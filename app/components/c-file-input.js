import Ember from 'ember';

function split(fileName) {
    var lastIndex = fileName.lastIndexOf('.');

    return {
        value: fileName.substr(0, lastIndex),
        extension: fileName.substr(lastIndex + 1, fileName.length)
    };
}

export default Ember.TextField.extend({
    fileSystem: Ember.inject.service(),
    attributeBindings: ['type', 'multiple', 'accept', 'title'],
    title: ' ',
    type: 'file',
    multiple: 'multiple',
    accept: 'audio/*,video/*',
    didInsertElement: function () {
        var fileSystem = this.get('fileSystem');

        this.$().onchange = function () {
            this.files.forEach(function (file) {
                var fileName = split(file.name);

                fileSystem.get('store').pushPayload('track', {
                    id: fileName.value,
                    name: fileName.value,
                    extension: fileName.extension
                });
            });

            this.files.forEach(function (file) {
                fileSystem.get('instance').root.getFile(file.name, {
                    create: true
                }, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.write(file);
                    });
                });
            });
        };
    }
});
