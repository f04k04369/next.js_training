export default async function SaerchPage({searchParams}: {searchParams: Promise<{category: string}>}) {
  const {category} = await searchParams;
  console.log("category", category);

  if(category) {
    fetchCategoryRestaurants(category);
  }

  const {data: nerarybyRamenRestaurants, error: nerarybyRamenRestaurantsError} = await fetchRamenRestaurants();
  return (
    <div>page</div>
  )
}

