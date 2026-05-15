import { fetchCategoryRestaurants } from "@/lib/restaurants/api";

export default async function SaerchPage({searchParams}: {searchParams: Promise<{category: string}>}) {
  const {category} = await searchParams;
  console.log("category", category);

  if(category) {
    const {data:categoryRestaurants, error: fetchError} = await fetchCategoryRestaurants(category);
    
        console.log("categoryRestaurants",categoryRestaurants);
  }
}

