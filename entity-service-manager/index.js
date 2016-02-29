var generators = require('yeoman-generator');
var chalk = require('chalk');

var prompts = [{
      type    : 'input',
      name    : 'existingFolderName',
      message : 'Would you like to create these files in existing an domain folder (eg. ''Properties'')? If so, enter the folder name.',
      default : 'none'
    }];


module.exports = generators.Base.extend({
    constructor: function () {
    generators.Base.apply(this, arguments);
    this.argument('entityname', { type: String, required: true });
  },
  config: function() {
    if(!this.config.get('dataAccessProjectNamespace')) {
      this.config.set('dataAccessProjectNamespace', "Buildium.Enterprise.Data");
    }
  },
  createFiles: function() {
    var done = this.async();
    var name = this.entityname;

    this.prompt(prompts, function promptCallback(answers) {
      var containingFolderName = name;

      if(answers.existingFolderName != 'none') {
        containingFolderName = answers.existingFolderName;
      }

      this.fs.copyTpl(
        this.templatePath('iservice.cs'),
        this.destinationPath('Api/Services/' + containingFolderName + '/I' + name + 'Service.cs'),
          { fileName: name, namespace: this.config.get('dataAccessProjectNamespace') + '.Api.Services.' + containingFolderName }
      );

      this.fs.copyTpl(
        this.templatePath('service.cs'),
        this.destinationPath('Api/Services/' + containingFolderName + '/' + name + 'Service.cs'),
          { fileName: name , namespace: this.config.get('dataAccessProjectNamespace') + '.Api.Services.' + containingFolderName }
      );

      this.fs.copyTpl(
        this.templatePath('imanager.cs'),
        this.destinationPath('Managers/' + containingFolderName + '/I' + name + 'Manager.cs'),
          { fileName: name, namespace: this.config.get('dataAccessProjectNamespace') + '.Managers.' + containingFolderName }
      );

      this.fs.copyTpl(
        this.templatePath('manager.cs'),
        this.destinationPath('Managers/' + containingFolderName + '/' + name + 'Manager.cs'),
          { fileName: name , namespace: this.config.get('dataAccessProjectNamespace') + '.Managers.' + containingFolderName }
      );

      this.fs.copyTpl(
        this.templatePath('entity.cs'),
        this.destinationPath('Entities/' + containingFolderName + '/' + name + '.cs'),
          { fileName: name , namespace: this.config.get('dataAccessProjectNamespace') + '.Entities.' + containingFolderName,
            frameworkFilePath: 'Buildium.Enterprise.Framework.Entities'}
      );

      done();
    }.bind(this));
  },
  complete: function() {
    this.log(chalk.bold.green('Successfully created new files...'));
  }
});
