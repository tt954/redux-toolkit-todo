import { useSelector } from 'react-redux';

import TodoItem from "./todoitem/TodoItem";
import { selectFilteredTodoIds } from '../../reducers/todosReducer';
import './todo-list.css';

const TodoList = () => {
  const todoIds = useSelector(selectFilteredTodoIds)

  return (
    <section className="h-80 overflow-y-scroll">
      <ul>
        {todoIds.map((todoId) => (
          <TodoItem key={todoId} id={todoId} />
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
