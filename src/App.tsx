import React, { useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";

function validateDuplicationEmail(email: string) {
  // @ts-ignore
  const { users } = this.from[1].value as { users: User[] };
  if (users.length < 2) return true;

  let dupCount = 0;
  for (let i = 0; i < users.length; i += 1) {
    if (users[i].email === email) {
      dupCount += 1;
      if (dupCount > 1) {
        return false;
      }
    }
  }

  return true;
}

const schema = yup.object().shape({
  users: yup.array(
    yup.object().shape({
      name: yup.string().required('name is required.'),
      email: yup
        .string()
        .required('email is required.')
        .email('invalid email type.')
        .test('email-dup', 'duplicated email', validateDuplicationEmail as yup.AssertingTestFunction<string>)
      ,
    }),
  ),
});

type User = {
  name: string,
  email: string
}

type FormType = {
  users: User[]
}

function App() {
  const { control, register, errors, handleSubmit } = useForm<FormType>({
    mode: 'onBlur',
    defaultValues: { users: [{ name: '', email: '' }] },
    resolver: yupResolver(schema),
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

  const userErrors = errors.users;

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <ul>
        {
          fields.map((user, i) => (
            <li key={user.id}>
              <input
                name={`users[${i}].name`}
                type="text"
                defaultValue={user.name}
                ref={register}
              />
              <input
                name={`users[${i}].email`}
                type="text"
                defaultValue={user.email}
                ref={register}
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
              >
                remove
              </button>
              <p style={{ color: 'red' }}>
                <span>
                  { userErrors && userErrors[i]?.name?.message }
                </span>
                <span>
                  { userErrors && userErrors[i]?.email?.message }
                </span>
              </p>
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
