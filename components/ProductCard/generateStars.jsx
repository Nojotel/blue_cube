import Image from "next/image";
import star from "@/public/star.svg";
import starHalf from "@/public/StarHalf.svg";
import starNone from "@/public/starNone.svg";

export const generateStars = (rating) => {
  let fullStars, halfStar, emptyStars;
  if (rating >= 4.6) {
    fullStars = 5;
    halfStar = false;
    emptyStars = 0;
  } else if (rating >= 4.2) {
    fullStars = 4;
    halfStar = true;
    emptyStars = 0;
  } else {
    fullStars = Math.floor(rating);
    halfStar = rating % 1 >= 0.6;
    emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  }
  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <Image key={i} src={star} alt="Full Star" width={16} height={16} />
      ))}
      {halfStar && <Image src={starHalf} alt="Half Star" width={16} height={16} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Image key={i} src={starNone} alt="Empty Star" width={16} height={16} />
      ))}
    </>
  );
};
