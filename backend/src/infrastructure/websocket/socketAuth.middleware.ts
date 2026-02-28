import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../../shared/constants/roleenum";
import { Socket } from "socket.io";
import { env } from "../../config/env";
import { parse } from "cookie";

interface SocketUserPayload extends JwtPayload {
  sub: string;
  companyId: string;
  role: Role;
}

export const verifySocketToken = (
  socket: Socket,
  next: (err?: Error) => void
): void => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Unauthorized"));
    }

    const cookies = parse(cookieHeader);
    const token = cookies.accessToken;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    ) as SocketUserPayload;

    socket.data.user = {
      id: decoded.sub,
      companyId: decoded.companyId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.log("Socket auth error:", err);
    return next(new Error("Unauthorized"));
  }
};