import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      const token = await getToken(); // Clerk JWT

      await axios.post(
        "http://localhost:5000/api/auth/sync",
        {
          email: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName,
          clerkId: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    };

    syncUser();
  }, [user]);

  return <div>Welcome, {user?.firstName}</div>;
};

export default Dashboard;
