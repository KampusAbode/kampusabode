
import toast from "react-hot-toast";


type UserData = {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
};

type AgentDetails = {
  name: string;
  email?: string;
  phoneNumber?: string;
  userInfo?: {
    agencyName?: string;
    [key: string]: any;
  };
};

type PropertyDetails = {
  id?: string;
  title?: string;
};

  
export const submitInspectionRequest = async (
  userdata: UserData,
  propertyDetails: PropertyDetails,
  agentDetails: AgentDetails,
  onSuccess?: () => void
) => {
  const data = {
    apartmentId: propertyDetails?.id || "",
    apartmentTitle: propertyDetails?.title || "",
    agentEmail: agentDetails?.email || "",
    agentNumber: agentDetails?.phoneNumber || "",
    agencyName:
      "agencyName" in agentDetails?.userInfo
        ? agentDetails.userInfo.agencyName
        : "",
    ...userdata,
  };

  try {
    // Now handle WhatsApp redirect on the client
    const message = `Hello ${agentDetails.name}, I'm ${
      data.name
    } and I would like to schedule an apartment inspection at the apartment you listed on Kampus Abode.\n\n📞 Phone: ${
      data.phone
    }\n📅 Date: ${data.preferredDate}\n⏰ Time: ${
      data.preferredTime
    }\n📝 Note: ${
      data.notes || "No additional notes"
    }\n\nPlease let me know if this works for you.`;

    window.open(
      `https://wa.me/+234${
        agentDetails.phoneNumber
      }?text=${encodeURIComponent(message)}`
    );
 toast.success("Redirecting to WhatsApp...", { id: "whatsapp-redirect" });

 if (onSuccess) onSuccess();
  } catch (err) {
    toast.error(err.message || "Failed to book inspection");
  }
};
