'''
Module contains functions for serialize and deserialize
:sqlalchemy: objects of declarative model to python collections.
Module support Integer and String types.
'''
from collections import Iterable, Mapping

def dumps(sa_data, count=0):
    '''
    Dumps :sqlalchemy: data to python collections.
    Return python collections.

    :param sa_data: :sqlalchemy: object of declarative model or query result.
    :param count: count of last elements of list.
    '''
    if isinstance(sa_data, Iterable):
        return [_dump(sa_object) for sa_object in sa_data][-count:] \
               if count else [_dump(sa_object) for sa_object in sa_data]
    else:
        return _dump(sa_data)

def _dump(sa_object):
    return {key: value for key, value in sa_object.__dict__.items() if not key.startswith('_')}

def loads(data, model, session):
    '''
    Loads data from python collections to :sqlalchemy: objects of declarative model.
    Return list of objects of declarative model or object of declaratiove model.

    :param data: Python collections data.
    :param model: Model to create objects.
    '''
    all_objects = []
    append_objects = []
    if isinstance(data, Iterable) and not isinstance(data, Mapping):
        for value in data:
            append, obj = _load(value, model, session)
            all_objects.append(obj)
            if append:
                append_objects.append(obj)
    else:
        append, obj = _load(data, model, session)
        all_objects.append(obj)
        if append:
            append_objects.append(obj)
    session.add_all(append_objects)
    session.commit()
    return list(map(lambda obj: obj.id, all_objects))

def _load(data, model, session):
    if 'id' in data:
        objs = session.query(model).filter(model.id == data['id'])
        if objs.count():
            obj = objs.first()
            for key, value in data.items():
                setattr(obj, key, value)
            return False, obj
        else:
            return True, _create_object(data, model)
    else:
        return True, _create_object(data, model)

def _create_object(data, model):
    return model(**{key:  value for key, value in data.items()})
