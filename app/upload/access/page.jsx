"use client";

import React, { useEffect } from "react";
import { properties } from "../../fetch/data/properties";
import { addPropertiesToFirestore } from "../../utils/api";

function CreateProfile() {
  useEffect(() => {
    // Define an async function to call addPropertiesToFirestore
    const uploadProperties = async () => {
      await addPropertiesToFirestore(properties);
    };

    // Call the async function
    uploadProperties();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div>
      <h2>Uploading Properties...</h2>
    </div>
  );
}

export default CreateProfile;
