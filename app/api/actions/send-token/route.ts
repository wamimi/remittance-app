// Import necessary functions and types from Solana actions, web3.js, and the SPL token library
import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createTransferInstruction } from "@solana/spl-token";

// GET request handler: provides metadata about the "Send Tokens" action
export const GET = async (req: Request) => {
  // Constructs the metadata payload
  const payload: ActionGetResponse = {
      title: "Send Tokens", // Title displayed for the action
      description: "Send tokens to another Solana wallet", // Action description
      label: "Send", // Button label
      icon: new URL("/solana_devs.jpg", req.url).toString(), // Sets an icon for the action
  };

  // Returns the payload in JSON format with CORS headers
  return new Response(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
  });
};

// OPTIONS request handler: allows CORS requests to function properly
export const OPTIONS = async (req: Request) => {
  // Returns an empty response with the appropriate CORS headers
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
};

// POST request handler: handles the actual token transfer between two wallets
export const POST = async (req: Request) => {
  try {
      // Parse the incoming request body, expecting recipient address, amount, and sender's details
      const body = await req.json() as {
          recipient: string;
          amount: number;
          senderPrivateKey: string;
          sender: string;
      };

      const { recipient, amount, senderPrivateKey } = body;

      // Establish a connection to the Solana devnet
      const connection = new Connection(clusterApiUrl("devnet"));

      // Convert the sender and recipient addresses to PublicKey objects
      const senderPublicKey = new PublicKey(body.sender);
      const recipientPublicKey = new PublicKey(recipient);

      // Get the associated token addresses for the sender and recipient wallets
      const senderTokenAddress = await getAssociatedTokenAddress(
          TOKEN_PROGRAM_ID, senderPublicKey
      );
      const recipientTokenAddress = await getAssociatedTokenAddress(
          TOKEN_PROGRAM_ID, recipientPublicKey
      );

      // Create a Solana transaction with a transfer instruction to move the tokens
      const transaction = new Transaction().add(
          createTransferInstruction(
              senderTokenAddress, // Sender's token account
              recipientTokenAddress, // Recipient's token account
              senderPublicKey, // Sender's public key
              amount // Amount of tokens to send
          )
      );

      // Construct the response payload with the transaction and a success message
      const payload: ActionPostResponse = await createPostResponse({
          fields: {
              transaction, // Include the transaction details
              message: `Send ${amount} tokens to ${recipient}`, // Success message
          },
      });

      // Return the response with the payload in JSON format and CORS headers
      return new Response(JSON.stringify(payload), {
          headers: ACTIONS_CORS_HEADERS,
      });
  } catch (err) {
      // If any error occurs during the token transfer, return a 500 status with an error message
      return new Response("Error sending tokens", { status: 500, headers: ACTIONS_CORS_HEADERS });
  }
};
