from flask_login import UserMixin
from . import db


class Users(db.Model, UserMixin):
  id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
  username = db.Column(db.String(255),nullable=False)
  lastname = db.Column(db.String(255),nullable=False)
  password = db.Column(db.String(255),nullable=False)
  email = db.Column(db.String(255),nullable=False)
  role = db.Column(db.String(255),nullable=False)
  phone = db.Column(db.String(255),nullable=False)
  country = db.Column(db.String(255),nullable=False)
  company = db.Column(db.String(255),nullable=False)
  address = db.Column(db.String(255),nullable=False)

  def __repr__(self):
    return f'{self.username},{self.lastname},{self.email},{self.phone},{self.country},{self.company},{self.address}'

class Meetings(db.Model):
  facility_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
  activity = db.Column(db.String(255), nullable=False)
  region = db.Column(db.String(255))
  venue = db.Column(db.String(255))
  date = db.Column(db.String(255),nullable=False)
  time = db.Column(db.String(255), nullable=False)
  facilitators = db.relationship('Facilitators', backref='facilitators', lazy=True)
  participants = db.relationship('Participants', backref='fields', lazy=True)

  def __repr__(self):
    return f'{self.activity},{self.region},{self.venue},{self.date},{self.time},{self.facility_id}'
  
  def serialize(self):
    return{
      'meeting_id':self.facility_id
    }

class Facilitators(db.Model):
  f_ID = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
  f_name = db.Column(db.String(255))
  f_lastname = db.Column(db.String(255))
  f_sex = db.Column(db.String(255))
  f_organization = db.Column(db.String(255))
  f_position = db.Column(db.String(255))
  f_phone = db.Column(db.String(255))
  f_email = db.Column(db.String(255))
  meetingId = db.Column(db.Integer, db.ForeignKey('meetings.facility_id'),nullable=False)

  def __repr__(self):
    return f'{self.f_name},{self.f_lastname},{self.f_sex},{self.f_organization},{self.f_position},{self.f_phone},{self.f_email},{self.f_signature}'

class Participants(db.Model):
  participant_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  name = db.Column(db.String(255))
  lastname = db.Column(db.String(255))
  sex = db.Column(db.String(255))
  organization = db.Column(db.String(255))
  position = db.Column(db.String(255))
  phone = db.Column(db.String(255))
  email = db.Column(db.String(255))
  meetingId = db.Column(db.Integer,  db.ForeignKey('meetings.facility_id'), nullable=False)

  def __repr__(self):
    return f'{self.name},{self.lastname},{self.sex},{self.organization},{self.position},{self.phone},{self.email}'
  
class Weeklogs(db.Model):
  log_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
  Weekday = db.Column(db.String(50))
  Calendar = db.Column(db.String(50))
  Activities = db.Column(db.String(1000))
  WeekNumber = db.Column(db.Integer, nullable=False)
  ModifiedBy = db.Column(db.String(150))

  def __repr__(self):
    f'{self.Weekday},{self.Calendar},{self.Activities},{self.ModifiedBy}'