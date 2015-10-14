import ComponentMdl from 'audio-app/components/c-mdl';

export default ComponentMdl.extend({
    classNames: ['mdl-layout__header-row', 'my-header-bar', 'my-edit-bar'],
    value: null,
    actions: {
        clearInput: function () {
            this.set('value', null);
        },
        done: function () {
            this.sendAction('done');
        }
    }
});
