import { useDispatch } from "react-redux";

import { filters, statusFilterChanged } from "../../../reducers/filtersReducer";

const StatusFilter = ({ value: status }) => {
  const dispatch = useDispatch();

  const handleStatusChange = (value) => {
    dispatch(statusFilterChanged(value));
  };

  const statuses = Object.keys(filters.statuses).map((key) => {
    const value = filters.statuses[key];
    const selected = value === status ? 'selected' : ''
    return (
      <li key={value}>
        <button className={`${selected} w-full rounded-full py-0.5 mb-0.5`} onClick={() => handleStatusChange(value)}>{key}</button>
      </li>
    );
  });

  return (
    <div className="flex-1 flex flex-col">
      <h3 className="heading">Filter by Status</h3>
      <ul>{statuses}</ul>
    </div>
  );
};

export default StatusFilter;
