import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { pusherServer } from "@/server/pusher/server";
import { db } from "@/server/db";
import { dateRequests } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.text();
  const params = new URLSearchParams(body);
  const socketId = params.get("socket_id");
  const channelName = params.get("channel_name");

  if (!socketId || !channelName) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  // Vérifier que l'utilisateur est participant du chat demandé
  // Format : private-chat-{requestId}
  const requestId = channelName.replace("private-chat-", "");
  const request = await db.query.dateRequests.findFirst({
    where: eq(dateRequests.id, requestId),
  });

  if (
    !request ||
    (request.requesterId !== session.user.id && request.targetId !== session.user.id)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const authResponse = pusherServer.authorizeChannel(socketId, channelName);
  return NextResponse.json(authResponse);
}
