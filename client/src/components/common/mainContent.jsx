// client/src/components/common/mainContent.jsx
import Header from "./header";

export default function MainContent() {
  const handleSignInClick = () => {
    console.log("Sign In button clicked");
    // You can add navigation or analytics logic here
  };

  return (
    <div>
      <Header onSignInClick={handleSignInClick} />
    </div>
  );
}