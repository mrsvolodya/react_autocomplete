// #region imports
import React, { useCallback, useState } from 'react';
import debaunce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
// #endregion
export const App: React.FC = () => {
  // #region hooks
  const [person, setPerson] = useState<Person>();
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focused, setFocused] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const appliedQueryDebounce = useCallback(debaunce(setAppliedQuery, 300), []);
  // #endregion
  // #region filter tools
  const filteredInputs = peopleFromServer.filter(p =>
    p.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  const noMatching = filteredInputs.length === 0 && !person;
  // #endregion
  // #region handlersEvents
  const handlerQueryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    appliedQueryDebounce(e.target.value);
    const chosenPeople = peopleFromServer.find(p => p.name === e.target.value);

    setPerson(chosenPeople);
  };

  const handlerPointQuery = (user: Person) => {
    setQuery(user.name);
    appliedQueryDebounce(user.name);
    const chosenPeople = peopleFromServer.find(p => p.name === user.name);

    setPerson(chosenPeople);
    setFocused(false);
  };
  // #endregion

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {!person
            ? 'No selected person'
            : ` ${person?.name} (${person?.born} - ${person?.died})`}
        </h1>

        <div className="dropdown is-active is-hoverable">
          <div className="dropdown-trigger">
            <input
              onFocus={() => setFocused(true)}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handlerQueryInput}
            />
          </div>
          {focused && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredInputs.map(user => (
                  <div
                    role="button"
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={user.name}
                    onClick={() => {
                      handlerPointQuery(user);
                    }}
                    onKeyDown={() => {
                      handlerPointQuery(user);
                    }}
                    tabIndex={0}
                  >
                    <p className="has-text-link">{user.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {noMatching && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};