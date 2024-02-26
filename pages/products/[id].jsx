import axios from "axios";
import { useRouter } from "next/router";

const ProductPage = ({ product }) => {
  return (
    <div>
      <h1>{product.title}</h1>
      <p>ID: {product.id}</p>
      <p>{product.description}</p>
      <p>{product.price} ₽</p>
      <p>Рейтинг: {product.rating}</p>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  const response = await axios.get(`https://skillfactory-task.detmir.team/products/${id}`);
  const product = response.data;
  return {
    props: {
      product,
    },
  };
}

export default ProductPage;
