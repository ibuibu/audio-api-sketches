import { Link } from 'react-router-dom';

export function Top() {
  const nums = [...Array(4).keys()].map((i) => i + 1);

  return (
    <>
      {nums.map((i) => {
        return (
          <div key={i}>
            <Link to={String(i)}>{i}</Link>
          </div>
        );
      })}
    </>
  );
}
