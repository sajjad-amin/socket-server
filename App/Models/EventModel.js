const Model = require('../../Core/Model/Model');
class EventModel extends Model {
    static getEventsByUserId(user_id){
        return this.getAll('events', [`user_id = '${user_id}'`]);
    }

    static getEventByTitle(title){
        return this.getOne('events', [`title = '${title}'`]);
    }

    static insertEvent(user_id, title, token, comment, date_created){
        return this.insert('events',{user_id, title, token, comment, date_created});
    }

    static deleteEvent(id){
        return this.delete('events', [`id = '${id}'`]);
    }
}
module.exports = EventModel;