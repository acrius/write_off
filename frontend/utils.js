export function load(query) {
  return fetch(query).then(response => response.json());
}

export function getStorageName(id, storages) {
  const storagesNames = storages.filter((storage) => storage.id === id)
                                .map((storage) => storage.name);
  return storagesNames.length === 1 ? storagesNames[0] : '';
}
