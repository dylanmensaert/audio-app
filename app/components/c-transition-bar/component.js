import ComponentMdl from 'audio-app/components/c-mdl';

export default ComponentMdl.extend({
    classNames: ['mdl-layout__header-row', 'my-header-bar'],
    title: null,
    actions: {
        selectAll: function () {
            this.sendAction('selectAll');
        },
        transitionToPrevious: function () {
            this.sendAction('transitionToPrevious');
        }
    }
});
