import { db } from "../../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function stripHtml(html: string) {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }
  
  // Handles GET requests to /api/apartments
  export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const view = searchParams.get("view"); // "ml" or default
  
      // Fetch all apartments from Firestore
      const snapshot = await getDocs(collection(db, "properties"));
  
      // Clean & structure data
      const apartments = snapshot.docs.map((doc) => {
        const data = doc.data();
  
        return {
          id: doc.id,
          title: data.title || "",
          type: data.type || "",
          price: data.price || 0,
          location: data.location || "",
          bedrooms: data.bedrooms || 0,
          bathrooms: data.bathrooms || 0,
          area: data.area || 0,
          amenities: data.amenities || [],
          description: stripHtml(data.description || ""),
          neighborhood: stripHtml(data.neighborhood_overview || ""),
          images: data.images || [],
          video: data.video || null,
          available: data.available ?? true,
        };
      });
  
      // 🔹 If ML view is requested, transform into Q&A pairs
      if (view === "ml") {
        const faq_data = apartments.flatMap((apt) => [
          {
            question: `What is the price of ${apt.title}?`,
            answer: `${apt.title} costs ₦${apt.price.toLocaleString()}.`,
          },
          {
            question: `Where is ${apt.title} located?`,
            answer: `It is located at ${apt.location}.`,
          },
          {
            question: `What amenities does ${apt.title} offer?`,
            answer: `${apt.title} includes: ${apt.amenities.join(", ")}.`,
          },
          {
            question: `How many bedrooms and bathrooms does ${apt.title} have?`,
            answer: `${apt.title} has ${apt.bedrooms} bedrooms and ${apt.bathrooms} bathrooms.`,
          },
        ]);
  
        return new Response(
          JSON.stringify({ success: true, count: faq_data.length, faq_data }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
  
      // 🔹 Default structured dataset
      return new Response(
        JSON.stringify({
          success: true,
          count: apartments.length,
          apartments,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error: any) {
      console.error("Error fetching apartments:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }