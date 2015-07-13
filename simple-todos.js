Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

    const Completed = function(storage) {
        const _hideCompletedAttr = "hideCompleted";
        return {
            'isHidden': function() {
                return storage.get(_hideCompletedAttr);
            },
            'setHidden': function(x) {
                storage.set(_hideCompletedAttr, x);
            }
        }
    }(Session);

    const taskQueryAll = {};
    const taskQueryNotChecked = {checked: {$ne: true}};
    const taskOrder = {sort: {createdAt: -1}};

    Template.body.helpers({
        tasks: function () {

            var taskQuery = Completed.isHidden()? taskQueryNotChecked : taskQueryAll;
            return Tasks.find(taskQuery, taskOrder);
        },
        hideCompleted: Completed.isHidden,
        incompleteCount: function () {
            return Tasks.find(taskQueryNotChecked).count();
        }
    });
    Template.body.events({
        "submit .new-task": function (event) {
            var $text = event.target.text;
            var text = $text.value;
            Tasks.insert({
                text: text,
                createdAt: new Date()
            });
            $text.value = "";
            return false;
        },
        "change .hide-completed input": function (event) {
            Completed.setHidden(event.target.checked);
        }
    });
    Template.task.events({
        "click .toggle-checked": function () {
            Tasks.update(this._id, {$set: {checked: !this.checked}});
        },
        "click .delete": function () {
            Tasks.remove(this._id);
        }
    });
}