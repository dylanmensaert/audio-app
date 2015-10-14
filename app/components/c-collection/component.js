import ComponentMdl from 'audio-app/components/c-mdl';

// TODO: duplication with audio-track/component
export default ComponentMdl.extend({
    // TODO: add placeholder left and right to row of cells that can help fix cell width layout
    classNames: ['mdl-cell', 'mdl-cell--2-col-phone', 'mdl-cell--2-col-tablet', 'mdl-cell--3-col-desktop', 'my-card-cell'],
    classNameBindings: ['model.isSelected:my-active'],
    model: null,
    showQueued: false,
    didInsertElement: function () {
        var outerImage = this.$('.my-outer-image'),
            innerImage = this.$('.my-inner-image');

        // TODO: duplicate with mdl-layout/component
        outerImage.height(outerImage.width() / 30 * 17);
        innerImage.height(innerImage.width() / 12 * 9);
        innerImage.css('top', -Math.floor((innerImage.height() - outerImage.height()) / 2));

        this._super();
    },
    // TODO: implement correct statusses
    hasStatus: function () {
        return this.get('model.isPlaying') || this.get('showQueued') || this.get('model.isDownloading') || this.get('model.isDownloaded');
    }.property('model.isPlaying', 'showQueued', 'model.isDownloading', 'model.isDownloaded'),
    click: null,
    actions: {
        toggleIsSelected: function () {
            var model = this.get('model');

            model.toggleProperty('isSelected');

            this.sendAction('toggleIsSelected', model);
        },
        click: function () {
            this.sendAction('action', 'collection', this.get('model'));
        }
    }
});
