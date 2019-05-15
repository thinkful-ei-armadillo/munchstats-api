

const EventsService = {
  // gets all of the user's events from the database
  getAllUserEvents(db, user_id){
    return db
      .from('events')
      .select('*')
      .where({user_id});
  },

  // finds a single event from the database via user id and the event's id
  getSingleUserEvent(db, user_id, id){
    return db
      .from('events')
      .select('*')
      .where({user_id, id});
  },

  // finds an array of the user's events within a date range from the database
  getUserEventByDate(db, user_id, start, end){
    return db
      .from('events')
      .select('*')
      .where({user_id})
      // date range 
      .andWhere('date', '>=', start)
      .andWhere('date', '<', end);
  },

  // inserts a new event in the database
  insertEvent(db, newEvent){
    return db
      .insert(newEvent)
      .into('events')
      .returning('*');
  },

  // deletes an event from the database via its id
  deleteEvent(db, id){
    return db
      .from('events')
      .where(id)
      .delete();
  },
};

module.exports = EventsService;