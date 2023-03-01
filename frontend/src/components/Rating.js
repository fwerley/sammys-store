import { StarFill, StarHalf, Star } from 'react-bootstrap-icons';

function Rating(props) {
  const { rating, numReviews, caption } = props;
  return (
    <div className="rating">
      <span>
        {
          rating >= 1
            ? <StarFill />//'fas fa-star'
            : rating >= 0.5
              ? <StarHalf />//'fas fa-star-half-alt'
              : <Star />//'far fa-star'
        }
      </span>
      <span>
        {
          rating >= 2
            ? <StarFill />
            : rating >= 1.5
              ? <StarHalf />
              : <Star />
        }
      </span>
      <span>
        {
          rating >= 3
            ? <StarFill />
            : rating >= 2.5
              ? <StarHalf />
              : <Star />
        }
      </span>
      <span>
        {
          rating >= 4
            ? <StarFill />
            : rating >= 3.5
              ? <StarHalf />
              : <Star />
        }
      </span>
      <span>
        {
          rating >= 5
            ? <StarFill />
            : rating >= 4.5
              ? <StarHalf />
              : <Star />
        }
      </span>
      {caption ? (
        <span>{caption}</span>
      ) : (
        <span>{' ' + numReviews} avaliações</span>
      )}
    </div>
  );
}

export default Rating;
