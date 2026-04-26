import CarouselContainer from "@/components/carousel-container";
import Categories from "@/components/categories";
import RestaurantCard from "@/components/restaurant-card";
import RestaurantList from "@/components/restaurant-list";
import Section from "@/components/section";
import { fetchRamenRestaurants, fetchRestaurants } from "@/lib/restaurants/api";
import Image from "next/image";

export default async function Home() {
  const {data: nerarybyRamenRestaurants, error: nerarybyRamenRestaurantsError} = await fetchRamenRestaurants();
  const {data: nerarbyRestaurants, error: nerarbyRestaurantsError} = await fetchRestaurants();

  return (
    <>
    

    <Categories />
    {/* レストラン情報表示 */}
      {!nerarbyRestaurants ? (
        <p>{nerarybyRamenRestaurantsError}</p>
      ): nerarbyRestaurants.length > 0 ? (
        <Section title="近くレストラン" expandedContent={<RestaurantList restaurants={nerarbyRestaurants}/>}>
        <CarouselContainer slideToShow={4}>
          {nerarbyRestaurants.map((restaurant, index) => (
            <RestaurantCard key={index} restaurant={restaurant}/>
          ))}
        </CarouselContainer>
      </Section>
      ): (
        <p>近くにレストランがありません</p>
      )}
      {!nerarybyRamenRestaurants ? (
        <p>{nerarybyRamenRestaurantsError}</p>
      ): nerarybyRamenRestaurants.length > 0 ? (

    /* ラーメン店情報表示 */
        <Section title="近くのラーメン店" expandedContent={<RestaurantList restaurants={nerarybyRamenRestaurants}/>}>
        <CarouselContainer slideToShow={4}>
          {nerarybyRamenRestaurants.map((restaurant, index) => (
            <RestaurantCard key={index} restaurant={restaurant}/>
          ))}
        </CarouselContainer>
      </Section>
      ): (
        <p>近くにラーメン店がありません</p>
      )}
    </>
  );
}
