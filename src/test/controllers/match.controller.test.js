import '../../server/models/users.model';
import * as CareerData from '../../server/config/json/career.data.js';
import * as ExpertiseData from '../../server/config/json/expertise.data.js';
import should from 'should';
import rp from 'request-promise';
import userData from '../fixtures/userData';

/*
 * Test for User API
 */

const API_BASE_URL = `http://localhost:${process.env.PORT}`;

let matchData;

describe('Test Match API', () => {

  describe('/mentorList', () => {
    it(': Sign up with valid Facebook user B.', (done) => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/users/signIn`,
        form: {
          access_token: userData.USER_B_FB_LONG_LIVED_ACCESS_TOKEN,
          platform_type: '1',
          deviceToken: 'a',
        },
        resolveWithFullResponse: true,
        json: true,
      })
        .then((result) => {
          result.statusCode.should.equal(201);
          userData.USER_B_DATA = result.body.user;
          userData.USER_B_DATA.access_token = result.body.access_token;
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
        });
    });

    it(': Request mentorList without expertise option.', (done) => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/match/mentorList`,
        form: {
          career: {
            area: 0,
            role: 0,
            years: 0,
            education_background: 0,
          },
        },
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      })
        .then((result) => {
          result.statusCode.should.equal(200);
          done();
        })
        .catch((err) => {
          should.fail(err.message);
          done();
        });
    });

    it(': Request mentorList with wrong parameter format.', (done) => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/match/mentorList`,
        form: {
          expertise: [],
          career: {
            area: 'All',
            role: 'All',
            years: 'All',
            education_background: 'All',
          },
        },
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      })
        .then((result) => {
          should.fail();
          done();
        })
        .catch((err) => {
          err.statusCode.should.equal(400);
          done();
        });
    });

    it(': Request mentorList.', (done) => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/match/mentorList`,
        form: {
          expertise: [],
          career: {
            area: 0,
            role: 0,
            years: 0,
            education_background: 0,
          },
        },
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      })
        .then((result) => {
          result.statusCode.should.equal(200);
          done();
        })
        .catch((err) => {
          should.fail(err.message);
          done();
        });
    });

    it(': Request the list of expected number of mentor.', (done) => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/match/mentorList/count`,
        form: {
          expertise: [],
          career: {
            area: 0,
            role: 0,
            years: 0,
            educational_background: 0,
          },
        },
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      })
        .then((result) => {
          result.statusCode.should.equal(200);
          done();
        })
        .catch((err) => {
          should.fail();
          done();
        });
    });
  });

  describe('/getCareerData', () => {
    it(': Fetch the career data for filter.', (done) => {
      rp({
        method: 'GET',
        uri: `${API_BASE_URL}/match/getCareerData`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      })
        .then((result) => {
          result.body.CareerData.area.length.should.equal(CareerData.CareerData.area.length);
          result.body.CareerData.role.length.should.equal(CareerData.CareerData.role.length);
          result.body.CareerData.years.length.should.equal(CareerData.CareerData.years.length);
          result.body.CareerData.educational_background.length.should
            .equal(CareerData.CareerData.educational_background.length);
          result.statusCode.should.equal(200);
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
        });
    });
  });

  describe('/getExpertiseData', () => {
    it(': Fetch the expertise data for filter.', (done) => {
      rp({
        method: 'GET',
        uri: `${API_BASE_URL}/match/getExpertiseData`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      })
        .then((result) => {
          result.body.ExpertiseData.length.should.equal(ExpertiseData.ExpertiseData.length);
          result.statusCode.should.equal(200);
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
        });
    });
  });

  describe('/request', () => {
    it(': request mentoring to Invalid User.', (done) => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/match/request`,
        form: {
          mentor_id: 'invaliduserid',
          subjects: 'Getting a job',
          contents: 'hi',
        },
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_B_DATA.access_token,
        },
      })
        .then((result) => {
          should.fail();
          done();
        })
        .catch((err) => {
          err.statusCode.should.equal(400);
          done();
        });
    });

    it(': User B request mentoring to User A', function (done) {
      //TODO issue :  this.timeout() doesn't work with arrow function.
      //For wating to send mail.
      this.timeout(10000);
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/match/request`,
        form: {
          mentor_id: userData.USER_A_DATA._id,
          subjects: 'Getting a job',
          contents: 'hi',
        },
        resolveWithFullResponse: true,
        json: true,
        timeout: 5000,
        headers: {
          access_token: userData.USER_B_DATA.access_token,
        },
      })
        .then((result) => {
          result.statusCode.should.equal(201);
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
        });
    });

    it(': User B Retrieve activity page.', (done) => {
      rp({
        method: 'GET',
        uri: `${API_BASE_URL}/match/activity`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_B_DATA.access_token,
        },
      })
        .then((result) => {
          matchData = result.body;
          result.statusCode.should.equal(200);
          result.body.pending.length.should.equal(1);
          result.body.accepted.length.should.equal(0);
          result.body.rejected.length.should.equal(0);
          result.body.requested.length.should.equal(0);
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
        });
    });
  });

  describe('/response', () => {
    it(': Sign up with User A.', (done) => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/users/signIn`,
        form: {
          access_token: userData.USER_A_FB_LONG_LIVED_ACCESS_TOKEN,
          platform_type: '1',
        },
        resolveWithFullResponse: true,
        json: true,
      })
        .then((result) => {
          result.statusCode.should.equal(200);
          userData.USER_A_DATA = result.body.user;
          userData.USER_A_DATA.access_token = result.body.access_token;
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
        });
    });

    it(': User A Retrieve activity page.', (done) => {
      rp({
        method: 'GET',
        uri: `${API_BASE_URL}/match/activity`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      })
        .then((result) => {
          matchData = result.body;
          result.statusCode.should.equal(200);
          result.body.pending.length.should.equal(0);
          result.body.accepted.length.should.equal(0);
          result.body.rejected.length.should.equal(0);
          result.body.requested.length.should.equal(1);
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
        });
    });

    it(': User A accept request from User B.', (done) => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/match/response`,
        form: {
          match_id: matchData.requested[0]._id,
          option: 1,  //accept
        },
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_A_DATA.access_token,
        },
      })
        .then((result) => {
          result.statusCode.should.equal(200);
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
        });
    });
  });

  describe('/activity', () => {
    it(': Sign up with User B.', (done) => {
      rp({
        method: 'POST',
        uri: `${API_BASE_URL}/users/signIn`,
        form: {
          access_token: userData.USER_B_FB_LONG_LIVED_ACCESS_TOKEN,
          platform_type: '1',
        },
        resolveWithFullResponse: true,
        json: true,
      })
        .then((result) => {
          result.statusCode.should.equal(200);
          userData.USER_B_DATA = result.body.user;
          userData.USER_B_DATA.access_token = result.body.access_token;
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
        });
    });

    it(': User B Retrieve activity page.', (done) => {
      rp({
        method: 'GET',
        uri: `${API_BASE_URL}/match/activity`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          access_token: userData.USER_B_DATA.access_token,
        },
      })
        .then((result) => {
          matchData = result.body;
          result.statusCode.should.equal(200);
          result.body.pending.length.should.equal(0);
          result.body.accepted.length.should.equal(1);
          result.body.rejected.length.should.equal(0);
          result.body.requested.length.should.equal(0);
          done();
        })
        .catch((err) => {
          should.fail(err);
          done();
        });
    });
  });

  describe('UnauthorizedAccess to API', () => {
    it(': request /activity without session coockie.', (done) => {
      unauthorizedAccessTest('GET', `${API_BASE_URL}/match/activity`, done);
    });

    it(': request /request without session coockie.', (done) => {
      unauthorizedAccessTest('POST', `${API_BASE_URL}/match/request`, done);
    });

    it(': request /response without session coockie.', (done) => {
      unauthorizedAccessTest('POST', `${API_BASE_URL}/match/response`, done);
    });
  });
});

function unauthorizedAccessTest(method, uri, done) {
  rp({
    method: method,
    uri: uri,
    resolveWithFullResponse: true,
    json: true,
  })
    .then((result) => {
      should.fail('Status Code should be 401');
      done();
    })
    .catch((err) => {
      err.statusCode.should.equal(401);
      done();
    });
}
