import { auth } from "../../../../auth";
import MemberState from "./MemberState";
import VisitorState from "./VisitorState";

async function AccountSection() {
  const session = await auth();
  return (
    <>
      {session?.user ? (
        <MemberState userInfo={session?.user} />
      ) : (
        <VisitorState />
      )}
    </>
  );
}

export default AccountSection;
