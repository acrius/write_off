export function load(query) {
  return fetch(query).then(response => response.json());
}
