import Categories from "@/components/categories";
import RestaurantList from "@/components/restaurant-list";
import { fetchCategoryRestaurants } from "@/lib/restaurants/api";
import { Suspense } from "react";

type SearchPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default function SaerchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<p className="text-muted-foreground py-8">読み込み中…</p>}>
      <SaerchPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SaerchPageContent({ searchParams }: SearchPageProps) {
  const { category } = await searchParams;
  console.log("category", category);

  if (!category) {
    return null;
  }

  const { data: categoryRestaurants, error: fetchError } =
    await fetchCategoryRestaurants(category);

  console.log("categoryRestaurants", categoryRestaurants);

  return (
    <>
    <div className="mb-4">
      <Categories />
    </div>
      {!categoryRestaurants ? (
        <p>{fetchError}</p>
      ) : categoryRestaurants.length > 0 ? (
        <RestaurantList restaurants={categoryRestaurants} />
      ) : (
        <p className="text-destructive">
          カテゴリ<strong>{category}</strong>に一致するレストランが見つかりません
        </p>
      )}
    </>
  );
}
