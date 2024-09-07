// Import necessary types and functions from @solana/actions, @solana/web3.js, and @solana/spl-token
import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";

// GET request handler: returns metadata about the "Receive Tokens" action
export const GET = async (req: Request) => {
  // Defines the payload with the action title, description, and icon
  const payload: ActionGetResponse = {
      title: "Receive Tokens",
      description: "Automatically detect received tokens",
      label: "Receive",
      icon: new URL("/solana_devs.jpg", req.url).toString(), // Sets an icon for the action
  };

  // Returns the payload as a JSON response with appropriate CORS headers
  return new Response(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
  });
};

// OPTIONS request handler(ensures CORS support)
export const OPTIONS = async (req: Request) => {
  // Returns a CORS-enabled response to allow cross-origin requests
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
};

// POST request handler processes token balance check for the given account
export const POST = async (req: Request) => {
  try {
      // Parses the incoming request body
      const body: ActionPostRequest = await req.json();
      const { account } = body; // Extracts the account from the body

      // Converts the account address to a Solana PublicKey
      const accountPublicKey = new PublicKey(account);

      // Creates a connection to Solana's devnet
      const connection = new Connection(clusterApiUrl("devnet"));

      // Retrieves the token account information
      const tokenAccount = await getAccount(
          connection,
          accountPublicKey,
          'confirmed' // Commitment level is set to "confirmed"
      );

      // Gets the balance from the token account
      const balance = tokenAccount.amount;

      // Creates a response payload with the balance information
      const payload = {
          message: `Received tokens, your balance is now ${balance}`,
      };
      
      // Returns the payload with the balance information
      return new Response(JSON.stringify(payload), {
          headers: ACTIONS_CORS_HEADERS,
      });
  } catch (err) {
      // Returns an error response if anything goes wrong
      return new Response("Error receiving tokens", {
          status: 500,
          headers: ACTIONS_CORS_HEADERS,
      });
  }
};
