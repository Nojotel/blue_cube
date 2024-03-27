import React, { FC } from "react";
import Image from "next/image";
import star from "@/public/star.svg";
import starHalf from "@/public/StarHalf.svg";
import starNone from "@/public/starNone.svg";
import { GenerateStarsProps } from "@/types/types";

const GenerateStars: FC<GenerateStarsProps> = ({ rating }) => {
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.6;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Image key={i} src={star} alt="Full Star" width={16} height={16} />);
    }
    if (halfStar) {
      stars.push(<Image key="half" src={starHalf} alt="Half Star" width={16} height={16} />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Image key={`empty-${i}`} src={starNone} alt="Empty Star" width={16} height={16} />);
    }
    return stars;
  };

  return <>{renderStars()}</>;
};

export default GenerateStars;
