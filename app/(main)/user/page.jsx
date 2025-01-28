"use client";
import { useEffect, useState } from "react";
import fetchGlobal from "@/lib/fetch-data";
import UserPageComponent from "@/components/user";

const UserPage = () => {
  const [response, setresponse] = useState();
  const [mutate, setMutate] = useState(0);

  useEffect(() => {
    fetchGlobal("/v1/users").then((res) => {
      setresponse(res);
    });
  }, [mutate]);

  return (
    <div className="w-full px-8 py-5">
      <h1 className="text-2xl">Manage Staff (Admin)</h1>
      <p className="text-sm" style={{ margin: "0 !important" }}>
        Manage your staff here
      </p>
      {/* Content */}
      <UserPageComponent
        data={response}
        reFetch={() => setMutate((num) => (num += 1))}
      />
    </div>
  );
};

export default UserPage;
