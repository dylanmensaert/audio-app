import Ember from 'ember';
import Recording from 'audio-app/audio-recording/object';

var split = function (fileName) {
    var lastIndex = fileName.lastIndexOf('.');

    return {
        value: fileName.substr(0, lastIndex),
        extension: fileName.substr(lastIndex + 1, fileName.length)
    };
};

export default Ember.TextField.extend({
    attributeBindings: ['type', 'multiple', 'accept', 'title'],
    title: ' ',
    type: 'file',
    multiple: 'multiple',
    accept: 'audio/*,video/*',
    didInsertElement: function () {
        var fileSystem = this.get('fileSystem'),
            recordings,
            fileName;

        this.$().onchange = function () {
            recordings = this.files.map(function (file) {
                fileName = split(file.name);

                return Recording.create({
                    id: fileName.value,
                    name: fileName.value,
                    extension: fileName.extension
                });
            });

            fileSystem.pushObjects(recordings);

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
