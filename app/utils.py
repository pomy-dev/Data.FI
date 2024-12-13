import calendar
import csv
import datetime
import random
import string
from app.models import Participants, Facilitators, Meetings, Users, Weeklogs
from . import db

def addTable(table_name, date):
  new_table  = Meetings(table_name=table_name, table_date=date)
  db.session.add(new_table)
  db.session.commit()

def addFacilitator(name,lastname,organization,sex,position,phone,email,signatire):
  new_facilitator = Facilitators(y_name=name,y_lastname=lastname,y_organization=organization,y_sex=sex,y_position=position,y_phone=phone,y_email=email,y_signatire=signatire)
  db.session.add(new_facilitator)
  db.session.commit()

def addClient(name,lastname,sex,organization,position,signature,tableId):
  new_client = Participants(name=name,lastname=lastname,sex=sex,organization=organization,position=position,signature=signature,tableId=tableId)
  db.session.add(new_client)
  db.session.commit()

def dumpStack(table_date,table_name,x_name,x_lastname,x_sex,x_organization,x_position,x_signature):
  columns = ["Date","Table","Name","Last Name","Sex","Organization","Position","Facility","Signature"]
  with open('DumpFiles/dump_site.csv', 'a', newline='') as file:
    writefile = csv.Dictwriter(file,fieldnames=columns)

    writefile.writeheader()

    row ={'Date':table_date,'Table':table_name,'Name':x_name,"Last Name":x_lastname,"Sex":x_sex,"Organization":x_organization,"Position":x_position,"Facility":table_name,"Signature":x_signature}
    writefile.writerow(row)

def generateFakeSignatures(length=8):
  # random lowercase letters for handwriting
  letters = string.ascii_lowercase
  signature = ''.join(random.choices(letters+string.punctuation, k=length))

  # adding some capital letters to mimic natural handwriting
  if random.choice([True,False]):
    signature = signature.capitalize()

  return signature

def addWeekLog(username,weekday,calendar, weeknumber, activities):
  username = username
  weekday = weekday
  calendar = calendar
  week = weeknumber
  activities = activities
  
  new_weeklog = Weeklogs(ModifiedBy=username,Weekday=weekday,Calendar=calendar, WeekNumber=week, Activities=activities)
  db.session.add(new_weeklog)
  db.session.commit()

def deleteWeeklog(id):
  activity = Weeklogs.query.get(id)
  if activity:
    db.session.delete(activity)
    db.session.commit()

def deleteUser(id):
  user = Users.query.get(id)
  if user:
    db.session.delete(user)
    db.session.commit()

def weekStack(weekday,calendar,activities,username):
  columns = ["Day","Calendar","Activities","Modified By"]
  with open('DumpFiles/weekLogs.csv','a', newline='') as file:
    writefile = csv.Dictwriter(file,fieldnames=columns)

    writefile.writeheader()

    row = {"Day":weekday,"Calendar":calendar,"Activities":activities,"Modified By":username}
    writefile.writerow(row)

def addNewUser(name,lastname,email,password,role,number,country,company,address):
  new_user = Users(username=name,lastname=lastname,email=email,password=password,role=role,phone=number,country=country,company=company,address=address)

  db.session.add(new_user)
  db.session.commit()

def get_current_week():
  # Get the current date
  today = datetime.datetime.now()
  
  # Get the week number (ISO format)
  week_number = today.isocalendar()[1]
  
  # Get the names of the days of the week
  day_names = list(calendar.day_name)

  # Generate the days of the current week along with their names
  week_days = [f"{day_names[i]}" for i in range(7)]
  
  return week_number, week_days

def getCurrentDate(week):
  activities = Weeklogs.query.filter_by(WeekNumber=week).all()
  activity_details = []
  for activity in activities:
    day = activity.Weekday
    m_day = day[:3]
    date = activity.Calendar
    m_date = date[-2:]
    year = date[:4]
    event = activity.Activities
    dayload = {'day':m_day,'date':m_date,'year':year,'event':event}
    activity_details.append(dayload)
  return activity_details

def addMeeting(title,region,date,time,venue):
  meeting = Meetings(activity=title,region=region,venue=venue,date=date,time=time)
  db.session.add(meeting)
  db.session.commit()

def addFacilitators(name,lastname,sex,organization,position,phone,email,meeting_id):
  facilitator = Facilitators(f_name=name,f_lastname=lastname,f_sex=sex,f_organization=organization,f_position=position,f_phone=phone,f_email=email,meetingId=meeting_id)
  db.session.add(facilitator)
  db.session.commit()

def addParticipants(name,lastname,sex,organization,position,phone,email,meeting_id):
  participator = Participants(name=name,lastname=lastname,sex=sex,organization=organization,position=position,phone=phone,email=email,meetingId=meeting_id)
  db.session.add(participator)
  db.session.commit()

def removeRecord(id):
  isMeeting = False; isFacilitators = False
  if id:
    meeting = Meetings.query.get(id)
    db.session.delete(meeting)
    db.session.commit()
    isMeeting = True
    print('=================step2=================')
  elif isMeeting:
    facilitators = Facilitators.query.filter_by(meetingId=id).all()
    for facilitator in facilitators:
      db.session.delete(facilitator)
      db.session.commit()
    isFacilitators = True
    print('=================step3=================')
  elif isFacilitators:
    participants = Participants.query.filter_by(meetingId=id).all()
    for participant in participants:
      db.session.delete(participant)
      db.session.commit()
    print('=================step4=================')
  else:
    return f'Could not complete transaction.'



    
