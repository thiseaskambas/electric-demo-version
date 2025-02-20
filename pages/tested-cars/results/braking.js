import { useState } from 'react';
import { getOneFileData } from '../../../lib/csvParser';
import { Braking } from '../../../components/TestTables';

export async function getStaticProps() {
  const data = await getOneFileData('braking');
  const sorted = [...data].sort((a, b) => a.Car.localeCompare(b.Car));

  return {
    props: {
      sorted,
    },
  };
}

const BrakingResults = ({ sorted }) => {
  const [query, setQuery] = useState('');

  const [filtered, setFiltered] = useState(sorted);

  const filterData = (string, arr) => {
    setQuery(() => string);
    setFiltered(() =>
      arr.filter((el) =>
        el.Car.toLowerCase()
          .split('-')
          .join(' ')
          .includes(string.toLowerCase().replaceAll('-', ' '))
      )
    );
  };

  const sortData = (sortBy) => {
    switch (sortBy) {
      case 'time':
        setFiltered((prev) =>
          [...prev].sort(
            (a, b) =>
              parseFloat(a.Secs100to0KmPerH.replace(',', '.')) -
              parseFloat(b.Secs100to0KmPerH.replace(',', '.'))
          )
        );
        break;
      case 'distance':
        setFiltered((prev) =>
          [...prev].sort(
            (a, b) =>
              parseFloat(a.Distance.replace(',', '.')) -
              parseFloat(b.Distance.replace(',', '.'))
          )
        );
        break;

      case 'alpha':
        setFiltered((prev) =>
          [...prev].sort((a, b) => a.Car.localeCompare(b.Car))
        );
        break;
      default:
        setFiltered(() => sorted);
    }
  };

  return (
    <>
      <form className=" w-full p-8 flex justify-center gap-2 dark:bg-transparent items-center flex-wrap">
        <label htmlFor="query" className="font-semibold">
          Filtrer :{' '}
        </label>
        <input
          className="w-32"
          id="query"
          value={query}
          onChange={(e) => filterData(e.target.value, sorted)}
          maxLength="20"
          autoComplete="off"
        />
        <div className="flex justify-center gap-2 dark:bg-transparent items-center flex-wrap">
          <div className="w-full text-center sm:w-fit sm:text-left">
            Trier par:
          </div>
          <button
            type="button"
            className="bg-white/30 text-white hover:bg-white/10 active:bg-black/10 transition-colors"
            onClick={() => sortData('time')}
          >
            Temps
          </button>
          <button
            type="button"
            className="bg-white/30 text-white hover:bg-white/10 active:bg-black/10 transition-colors"
            onClick={() => sortData('distance')}
          >
            Distance
          </button>
          <button
            type="button"
            className="bg-white/30 text-white hover:bg-white/10 active:bg-black/10 transition-colors"
            onClick={() => sortData('alpha')}
          >
            Ordre alphabétique
          </button>
        </div>
      </form>
      <div className="bg-slate-200 dark:bg-light-primary-2 sm:p-10">
        <Braking
          tests={filtered}
          fullTest={true}
          className="sm:rounded-xl overflow-x-auto sm:border bg-white dark:bg-transparent "
        />
      </div>
    </>
  );
};

export default BrakingResults;
