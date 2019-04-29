'use strict';

const EventsService = {
  getAllUserEvents(db, user_id){
    return db
      .from('events')
      .select('*')
      .where({user_id});
  },

  getSingleUserEvent(db, user_id, id){
    return db
      .from('events')
      .select('*')
      .where({user_id, id});
  },

  getUserEventByDate(db, user_id, date){
    return db
      .from('events'
      .select('*'))
      .where({user_id, date});
  },

  insertEvent(db, newEvent){
    return db
      .insert(newEvent)
      .into('events')
      .returning('*');
  },

  deleteEvent(db, id){
    return db
      .from('events')
      .where(id)
      .delete();
  },
};

module.exports = EventsService;