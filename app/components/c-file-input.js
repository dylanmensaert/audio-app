import Ember from 'ember';
import Track from 'audio-app/track/object';

var split = function (fileName) {
    var lastIndex = fileName.lastIndexOf('.');

    return {
        value: fileName.substr(0, lastIndex),
        extension: fileName.substr(lastIndex + 1, fileName.length)
    };
};

export default Ember.TextField.extend({
    fileSystem: Ember.inject.service(),
    attributeBindings: ['type', 'multiple', 'accept', 'title'],
    title: ' ',
    type: 'file',
    multiple: 'multiple',
    accept: 'audio/*,video/*',
    didInsertElement: function () {
        var fileSystem = this.get('fileSystem'),
            tracks,
            fileName;

        this.$().onchange = function () {
            tracks = this.files.map(function (file) {
                fileName = split(file.name);

                return Track.create({
                    id: fileName.value,
                    name: fileName.value,
                    extension: fileName.extension
                });
            });

            fileSystem.pushObjects(tracks);

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
