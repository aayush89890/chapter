import assert from 'assert';
import chai, { expect } from 'chai';
import { stub, restore } from 'sinon';
import sinonChai from 'sinon-chai';
import MailerService from 'src/services/MailerService';
import Utilities from 'src/util/Utilities';

chai.use(sinonChai);

beforeEach(() => {
  stub(console, 'warn');
});

afterEach(() => {
  // Restore the default sandbox here
  restore();
});

// Setup
const emailAddresses = [
  '123@test.com',
  '567@tester.com',
  'helloWorld@worldOfHello.com',
];
const subject = 'Welcome To Chapter!';
const htmlEmail = '<div><h1>Hello Test</h1></div>';
const backupText = 'Email html failed to load';

describe('MailerService Class', () => {
  it('Should assign the email username, password, and service to transporter', () => {
    const mailer = new MailerService(
      emailAddresses,
      subject,
      htmlEmail,
      backupText,
    );

    const { auth, service } = mailer.transporter.options as any;
    assert.equal(service, mailer.emailService);
    assert.equal(auth.user, mailer.emailUsername);
    assert.equal(auth.pass, mailer.emailPassword);
  });

  it('Should correctly instantiate values', () => {
    const mailer = new MailerService(
      emailAddresses,
      subject,
      htmlEmail,
      backupText,
    );

    assert.equal(subject, mailer.subject);
    assert.equal(htmlEmail, mailer.htmlEmail);
    assert.equal(backupText, mailer.backupText);
    expect(emailAddresses).to.have.members(mailer.emailList);
  });

  it('Should provide a blank string if backup text is undefined', () => {
    const mailer = new MailerService(emailAddresses, subject, htmlEmail);
    assert.equal(mailer.backupText, '');
  });

  it('Should log a warning if emailUsername, emailPassword, or emailService is not specified', () => {
    stub(Utilities, 'allValuesAreDefined').callsFake(() => false);
    new MailerService(emailAddresses, subject, htmlEmail);
    expect(console.warn).to.have.been.calledOnce;
  });
});
