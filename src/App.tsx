import React, { useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

type User = {
  name: string,
  email: string
}

type FormType = {
  users: User[]
}

function App() {
  const { control, register, handleSubmit } = useForm<FormType>({
    mode: 'onChange',
    defaultValues: { users: [{ name: '', email: '' }] }
  });

  const { fields, append, remove } = useFieldArray<User>({
    control,
    name: 'users',
  })

  const appendRow = useCallback(() => {
    append({ name: '', email: '' });
  }, [append])

  const removeRow = useCallback((index: number) => {
    remove(index);
  }, [remove]);

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <ul>
        {
          fields.map((user, i) => (
            <li key={user.id}>
              <input name={`users[${i}].name`} type="text" defaultValue={user.name} ref={register()} />
              <input name={`users[${i}].email`} type="text" defaultValue={user.email} ref={register()} />
              <button type="button" onClick={() => removeRow(i)}>remove</button>
            </li>
          ))
        }
      </ul>
      <button type="button" onClick={appendRow}>add</button>
      <button type="submit">submit</button>
    </form>
  );
}

export default App;
