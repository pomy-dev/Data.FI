import datetime
import os
from pathlib import Path
from flask import Blueprint, flash, jsonify, redirect, render_template, request, url_for
from flask_login import current_user, login_required
from sqlalchemy import func
from app.utils import addFacilitators, addMeeting, addParticipants, addWeekLog, deleteWeeklog, get_current_week, getCurrentDate, removeRecord, weekStack
from app.models import Facilitators, Meetings, Participants, Users, Weeklogs
from . import db
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash

views = Blueprint('views', __name__)

@views.route('/home')
@login_required
def home():
  user = current_user
  current_week, week_days = get_current_week()
  week_schedule = getCurrentDate(current_week)
  
  year = datetime.datetime.now().year
  thisYear = datetime.datetime(year,6,30).strftime('%Y')

  meetings = Meetings.query.all()

  groupedMeetings = Meetings.query.group_by(Meetings.activity).all()

  healthFacilities = [
    'Flas Clinic','RFM Hospital','Mankayane Hospital','Mafutseni Clinic','Mpuluzi Clinic',
    'AHF Clinic','Hospice At Home','Remand Center Clinic','Phocweni UEDF Clinic','Gcina Garrison Clinic','Women & Men Health Care Clinic',
    'Wellness Center Clinic','Vuvulane Clinic','Vusweni Clinic','Vulamehlo Outreach Site','Tsaneni Clinic','Tobhoyi Clinic',
    'Tobhoyi Outreach Site','TLC-Mbabane Drop-In Center','TLC-Manzini Drop-In Center','TLC-Manzini Drop-In Center',
    'TLC-Miracle Campus Hospital','Tjedze Outreach Site','Tikhuba Clinic','St. Marys Clinic','St. Theresas Clinic','Sulutane Outreach Site',
    'Swaziland Hospice At Home','Tabankulu Estates Clinic','TASC Manzini','TB Center','Tfokotani Clinic',
    'The Children Center Of Excellence','Tholulwazi Outreach','Sisingeni Health Post','Siteki Nazarene Clinic',
    'Sithobela Health Center Wellness','Sitsatsaweni Nazarene Clinic','SOS Clinic (Ekutfokomeni Clinic)','SOS Clinic (Nhlangano)',
    'St. Augustine Outreach','St. Florence Clinic','St. Juliana Clinic','Sbovu Clinic (Mahlangatja)','Sdvokodvo Railway Outreach',
    'Sgangeni Clinic','Sigombeni Nazarene Clinic','Sgcineni Clinic','Sgombeni Red Cross Clinic','Sgombeni Red Cross Clinic',
    'Sihawu Community Clinic','Silele Red Cross Clinic','SimplyAid Medical Services','Sinceni Clinic',
    'Siphocosini Clinic','Siphofaneni Clinic','RFM-MNCH','RFM-NCD','RFM-Private OPD','RSP Clinic','S&P Health Care Center',
    'Salvation Army Clinic (Mbhuluzi)','Sappi Health Center','Satellite Clinic','Shewula Nazaren Clinic','Sibonginkhosi Medical Center',
    'Sibovini Outreach Site','Phunga Clinic','Phuzumoya Railway Outreach','PSI Manzini','Psychiatric Clinic',
    'Psychiatric Hospital National','Regional Mundi Clinic','Remand Prison','RFM-ART','Nyanyali Outreach Site','Nyonyane Clinic',
    'Nzongomane Outreach Site','Othandweni Outreach (Nhlangano)','Our Lady of Sorrows Clinic','Phunga Clinic',
    'Nhlangano Public Health Unit','Nhlangunjani Clinic','Nhlentjeni Clinic','Nkaba Clinic','Nkhalashane Community Clinic',
    'Nkomanzi Clinic','Nkonjwa Clinic','Nkoyoyo UEDF Clinic','Nkwene Clinic','Nsalitje Clinic','Nsingizini UEDF Clinic',
    'Ntfonjeni Clinic','Ngculwini Nazarene Clinic','Ntshanini Clinic','Ngomane Clinic','Ngoni Outreach Site','Ngonini (OSSU) Clinic',
    'Ngonini Estate Clinic','Ngowane Clinic','Ngwavuma UEDF Clinic','Nhlambeni Clinic','Nhlangano Correctional Clinic','Nhlangano H.C Wellness Clinic',
    'Nhlangano Health Center','National Baptist Mission Clinic','Ncabaneni Outreach Site','Ncangosini Outreach Site','Ndabeni Outreach Site','Ndlalane Outreach Site',
    'Ndvwabangeni Nazarene Clinic','Ndzevane Clinic','Ndzingeni Nazarene Clinic','New Haven Clinic','New Thulwane Clinic','New Village Nazarene Clinic','Ngcina Outreeach Site',
    'Ngculwini Nazarene Clinic','Mliba Nazarene Clinic','Mlindazwe UEDF Clinic','Mooihoek Outreach Site','Moti Clinic','Mpaka Railway Clinic','Mphabayi Outreach Site','Mpaka Railway Clinic',
    'Motshane Community Clinic','Mpolonjeni Clinic','Mshingishini Nazarene Clinic','Musi Clinic','Mzipha Outreach Site','Mzipha Outreach Site','National Baptist Mission Clinic','National Events',
    'Mbuluzi UEDF Clinic','Mdzimba UEDF Clinic','Mgababa Outreach Site','Mgazini Clinic','Mhlalweni Outreach','Mhlosheni Clinic','Mhlume Medical Services','Mkhitsini Clinic','Mkhiweni II Outreach Site',
    'Mkhulamini Clinic','Mlawula Railway Outreach','Mliiba Nazarene Clinic','Mawelawela Women Correctional Services Clinic','Mbangweni UEDF Clinic','Mbilaneni Outreach','Mbosi Outreach Site','Mbosi II Outreach',
    'Manzini Health Care','Manzini School Outreach Site','Manzini Town Council','Maphalaleni Clinic','Mashoobeni Clinic','Mathangeni Church Of Christ Clinic','Matsanjeni Wellness','Matsanjeni Health Public Health Unit',
    'Matsanjeni Health Center','Matsapha Central Prison','Matsapha Central Prison','Matsetsa Outreach','Mavalela Clinic','Mavuso Covid-19 Center','Mambane Clinic','Mampempeni Outreach','Mananga Clinic','Mandulo Outreach Site',
    'Mangcongco Clinic','Mangweni Clinic','Manhleka Outreach Site','Mankayane Correctional services Clinic','Mankayane Public Health Unit','Manyeveni Nazarene Clinic','Manzana Clinic','Manzini Government Hospital',
    'Manzini Government wellness Clinic','Manzini Health Care','Mahlandle Clinic','Mahwalala Red Cross Clinic','Malandzela Nazarene Clinic','Malindza Refugee Camp Clinic','Malkerns Family Life  Association','Malkerns Juvenile industrial School Clinic',
    'Malkerns Young Persons Correctional Institution','Mallmed Family Clinic','Maloma Colliery Clinic','Maloyi Clinic','Lubuli Clinic','Lulama Health Clinic','Lushikishini Clinic','Luve Clinic','Luyengo Clinic','Luyengo Students Clinic',
    'Magomba outreach site','Magubheleni Clinic','Maguga Clinic','Magwenya Outreach Site','Mahhoshe Oureach Site','KM III Clinic','Kudvumisa Foundation','Kwaluseni University Clinic','Lamvelase Clinic (Zombodze)','Lamvelase Help Center-AHF',
    'Letindze Outreach Site','Lobamba Clinic','Lomahasha Clinic','Lubane','Ikwezi joy Clinic','JCI (Mphelandzaba) Clinic','Jericho Clinic','Jikani Lambu Medical Center','KaMfishane Clinic','Kaphunga Nazarene Clinic','Ka-Zondwako Clinic',
    'Kholwane I outreach Site','Kholwane II outreach Site','Khuphuka Clinic','King Sobhuza II Health Unit','Hillside Clinic','Hlane clinic','Hope House Palliative Care Center','Horo Clinic','Gebeni Clinic','Gege Clinic','Gilgal Clinic','Giving Life Clinic','Good Shepherd Catholic Hospital Wellness Clinic',
    'Good Sheperd Hospital','Good Sheperd Public Health Center','Gucuka Clinic (formerly outreach site)','Herefords Community Clinic','Hhalane','Ezindwendweni Clinic','Family Care Clinic (Nhlangano)','FHI 360 Manzini','FTM Clinic','G.U Manzini (BLOSSOM)',
    'Gcina UEDF Clinic','Dwaleni Clinic','Dwalile Clinic','Dzakaseni Outreach Site','Ebemmezer Clinic','Ekufikeni Clinic','Ekumeni Outreach Site','Ekuphileni Clinic','Ekuphileni MVA Clinic','Emkhuzweni Health Center','Esweni Outreach Site','Etetsembisweni Clinic',
    'CMIS Events','Correctional Clinic (Bhalekane)','Correction College Staff Clinic','Criminal Lunatic Assylum Clinic','Diabeties Clinic','Dinga Outreach Site','Dr. B.B and R.S GAMA','Dr.Gazi Surgery','Dreamms Outreach Manzini','Dumako Outreach Site',
    'Dvokodvweni Outreach Site','Dvokolwako Health Center','Dvumbe Outreach','Bhudla Clinic','Big Bend Prison Clinic','Bulandzeni Clinic','Bulembu Clinic (Havelock)','Bulunga Nazarene Clinic','Business Center','Cabrini Ministries Health Care',' Cana Mission  Clinic',
    'Carers Corner Clinic',' Casualty Department','Central Medical Stores','Chakaza Emphilweni Clinic','Clicks Clinic Matsapha'                            
  ]

  sortedList = sorted(healthFacilities)

  return render_template('index.html',facilities=sortedList,meetings=meetings,group_meetings=groupedMeetings,weekSchedule=week_schedule, year=thisYear, week=current_week, days=week_days, user=user)

@views.route('/weeklog', methods=["GET","POST"])
@login_required
def WeekLog():
  username = current_user.username
  weekday = request.json['weekday']
  calendar = request.json['calendar']
  activities = request.json['activities']
  weeknumber, days = get_current_week()

  try:
    addWeekLog(username=username,weekday=weekday,calendar=calendar,weeknumber=weeknumber, activities=activities)
  except:
    flash('Error: could not add activity. Try again!!')
    try:
      weekStack(weekday=weekday,calendar=calendar,activities=activities,username=username)
    except:
      flash('Error: corrupt file, could not open dumpStack file','error')
  
  return jsonify({})

@views.route('/activities')
@login_required
def activities():
  week_activities=Weeklogs.query.all()
  return jsonify([{'day': activity.Weekday, 'date': activity.Calendar, 'activities':activity.Activities, 'id':activity.log_id} for activity in week_activities])

@views.route('/users')
@login_required
def users():
  users = Users.query.all()
  return jsonify([{'id':user.id,'name':user.username,'lastname':user.lastname,'email':user.email,'password':user.password,'role':user.role,'phone':user.phone,'country':user.country,'company':user.company,'address':user.address} for user in users])

@views.route('/delete/<int:id>', methods=["POST","GET"])
@login_required
def delete_activity(id):
  try:
    deleteWeeklog(id)
  except:
    flash('Error: could not find the record. Issues with id!!')
    return jsonify({})
  return jsonify({})

@views.route('/update/<int:id>', methods=["POST","GET"])
@login_required
def update_activity(id):
  data = request.get_json()
  activity = Weeklogs.query.get(id)
  if activity:
      activity.Weekday = data['day']
      activity.Calendar = data['date']
      activity.Activities = data['activity']
      activity.ModifiedBy = data['user']
      db.session.commit()
      return jsonify({})
  return jsonify({}), 404

@views.route('/recordMeeting', methods=["POST","GET"])
@login_required
def record_meeting():
  # get the meeting vital data
  title = request.json['title']
  region = request.json['region']
  date = request.json['date']
  time = request.json['time']
  venue = request.json['venue']

  try:
    addMeeting(title=title,region=region,date=date,time=time,venue=venue)
  except:
    flash('Error: could not add meeting details. Try again!!')
  
  return jsonify({})

@views.route('/getMeetingId', methods=["POST","GET"])
@login_required
def getMeetingId():
  id = db.session.query(Meetings).order_by(Meetings.facility_id.desc()).first();
  return jsonify({'id':id.serialize()['meeting_id']})

@views.route('/recordFacilitators', methods=["POST","GET"])
@login_required
def record_facilitators():
  # get the meeting facilitators
  name = request.json['name']
  lastname = request.json['lastname']
  sex = request.json['sex']
  organization = request.json['organization']
  position = request.json['position']
  phone = request.json['phone']
  email = request.json['email']
  meet_id = request.json['meetingId']

  try:
    addFacilitators(name=name,lastname=lastname,organization=organization,sex=sex,position=position,phone=phone,email=email,meeting_id=meet_id)
  except:
    flash('Error: could not add facilitators details. Try again!!', 'error')
  
  return jsonify({})

@views.route('/recordParticipants', methods=["POST","GET"])
@login_required
def record_participants():
  # get the meeting facilitators
  name = request.json['name']
  lastname = request.json['lastname']
  sex = request.json['sex']
  organization = request.json['organization']
  position = request.json['position']
  phone = request.json['phone']
  email = request.json['email']
  meet_id = request.json['meetingId']

  try:
    addParticipants(name=name,lastname=lastname,organization=organization,sex=sex,position=position,phone=phone,email=email,meeting_id=meet_id)
  except:
    flash('Error: could not add facilitators details. Try again!!', 'error')
  
  return jsonify({})

@views.route('/getMeetingDetails/<int:id>')
@login_required
def getMeetingDetails(id):
  meeting = Meetings.query.filter_by(facility_id=id).first()
  m_details = {"title":meeting.activity,"region":meeting.region,"date":meeting.date,"time":meeting.time,"venue":meeting.venue}
  m_facilitators =[]
  m_participants = []
  for x in meeting.facilitators:
    data =  {"name":x.f_name,"lastname":x.f_lastname,"organization":x.f_organization,"sex":x.f_sex,"position":x.f_position,"phone":x.f_phone,"email":x.f_email}
    m_facilitators.append(data)
  
  for y in meeting.participants:
    data =  {"name":y.name,"lastname":y.lastname,"organization":y.organization,"sex":y.sex,"position":y.position,"phone":y.phone,"email":y.email,"meetingId":y.meetingId}
    m_participants.append(data)

  return jsonify({'meeting':m_details,"facilitators":m_facilitators,"participants":m_participants})

@views.route('/getCadra/<int:id>',methods=["GET","POST"])
@login_required
def getCadra(id):
  cadra = Meetings.query.filter_by(facility_id=id).first()
  cadra_details = {'title':cadra.activity,'date':cadra.date};
  results = (
      db.session.query(
          Participants.position,
          func.count(Participants.sex).filter(Participants.sex == 'Male').label('Males'),
          func.count(Participants.sex).filter(Participants.sex == 'Female').label('Females'),
          func.count(Participants.sex).label('total')
      ).filter(Participants.meetingId == id)
      .group_by(Participants.position)
      .all()
    )

  # Prepare the results for JSON response
  grouped_data = [{'position': position, 'males':Males, 'females':Females,'total':total} for position, Males, Females, total in results]
  
  return jsonify({'cadra':grouped_data,'meeting':cadra_details})

@views.route('/create-folder', methods=["GET","POST"])
@login_required
def createFolder():
  data = request.get_json();
  folder_name = data.get('folderName')

  if not folder_name:
    return jsonify(success = False, message='Folder name is required'), 400
  
  folder_path = os.path.join(os.getcwd(),'app','static', 'FolderSheets', folder_name)

  if os.path.exists(folder_path):
    return jsonify(success=False, message=f'Folder {str(folder_name)} already exists.Try a different word.'), 400
  
  try:
    os.mkdir(folder_path)
    return jsonify(success=True,message=f'Folder {str(folder_name)} created successfully.')
  except Exception as e:
    return jsonify(success=False, message=f'Failed to create folder: {str(e)}'), 500

@views.route('/find-folders')
@login_required
def findFolder():
  folder_path = os.path.join(os.getcwd(), 'app','static', 'FolderSheets');
  folderPath = Path(folder_path);
  folders = []; folders = [folder for folder in os.listdir(folderPath)];
  return jsonify([{'foldername': folder} for folder in folders])

@views.route('/savefile', methods=["GET","POST"])
@login_required
def save_file():
  user = current_user
  if 'file' not in request.files:
    flash(f'None file was uploaded!!', 'error')

  file = request.files['file']
  folder =  request.form['folder']

  if file == '':
    return jsonify({'message':"No file input found!!"})
  elif file.filename == '':
    flash('File name could not be found/read!!', 'error')
    return redirect(url_for('views.files/'+folder))

  try:  
    if file:
      file_name = secure_filename(file.filename)
      file.save(os.path.join(os.getcwd(),'app','static','FolderSheets', folder, file_name))
      flash(f'File: {file_name} saved successfully.','success')
  except Exception as e:
    flash(f'Failed to insert file: {str(e)}', 'error')

  try:

    files_path = os.path.join(os.getcwd(), 'app','static', 'FolderSheets', folder)
    folderItems = os.listdir(files_path)

    files = [item for item in folderItems if os.path.isfile(os.path.join(os.getcwd(), 'app','static', 'FolderSheets', folder,item))]

  except FileNotFoundError:
    flash(f'No files found in {folder} folder!!','error')

  return render_template('sheets.html',venue=folder,user=user, files=files)

@views.route('/files/<facility>')
@login_required
def files(facility):
  user = current_user
  try:

    files_path = os.path.join(os.getcwd(), 'app','static', 'FolderSheets', facility)
    folderItems = os.listdir(files_path)

    files = [item for item in folderItems if os.path.isfile(os.path.join(os.getcwd(), 'app','static', 'FolderSheets', facility,item))]
  except FileNotFoundError:
    flash(f'No files found in {facility} folder!!','error')

  return render_template('sheets.html',venue=facility, user=user, files=files)

@views.route('/remove_file/<folder>/<doc>', methods=["POST","GET"])
@login_required
def remove_file(folder, doc):
  try:
    file_location = os.path.join(os.getcwd(),'app','static','FolderSheets',folder, doc);
    if os.path.exists(file_location):
      os.remove(file_location);
    return jsonify({'mssg':'File '+doc+' removed successfully.'})
  except:
    return jsonify({'mssg':'Failed to remove file '+doc+'. Try again.'})

@views.route('/getAllMeetings', methods=["GET","POST"])
@login_required
def meetings():
  meetings = Meetings.query.all();
  return jsonify([{'date':meeting.date,'title':meeting.activity,'venue':meeting.venue,'region':meeting.region,'time':meeting.time} for meeting in meetings])

@views.route('/getMeetingByVenue/<venue>', methods=["GET","POST"])
@login_required
def meetingTitle(venue):
  meetings = Meetings.query.filter_by(venue=venue).all();
  return jsonify([{'date':meeting.date,'time':meeting.time,'venue':meeting.venue,'region':meeting.region,'title':meeting.activity} for meeting in meetings])

@views.route('/getMeetingByActivity/<activity>', methods=["GET","POST"])
@login_required
def meetingActivity(activity):
  meetings = Meetings.query.filter_by(activity=activity).all();
  return jsonify([{'date':meeting.date,'time':meeting.time,'venue':meeting.venue,'region':meeting.region,'title':meeting.activity} for meeting in meetings])

@views.route('/getMeetingByDate/<start_date>/<end_date>', methods=["GET","POST"])
@login_required
def meetingDate(start_date, end_date):
  meetings = Meetings.query.all();

  return jsonify([{'date':meeting.date,'time':meeting.time,'venue':meeting.venue,'region':meeting.region,'title':meeting.activity} for meeting in meetings if meeting.date >= start_date and meeting.date <= end_date])

@views.route('/yearQuarter', methods=["GET","POST"])
@login_required
def yearQuarter():
  meetings = Meetings.query.all();
  year = datetime.datetime.now().year;

  month = request.json['lastQuater'];

  first_year_month = 1
  first_month = datetime.datetime(year,first_year_month,1)
  january = first_month.strftime('%Y-%m-%d')

  final_month = int(month)
  month_last = datetime.datetime(year,final_month,29)
  quarter = month_last.strftime('%Y-%m-%d')
  return jsonify([{'date':meeting.date,'time':meeting.time,'venue':meeting.venue,'region':meeting.region,'title':meeting.activity} for meeting in meetings if meeting.date >= january and meeting.date <= quarter])

@views.route('/updateUser/<id>', methods=["GET","POST"])
@login_required
def updateUser(id):
  data = request.get_json()
  user = Users.query.filter_by(id=id).first();

  if user:
      user.username= data['name']
      user.lastname = data['lastname']
      user.company = data['company']
      user.country = data['country']
      user.email = data['email']
      user.role = data['role']
      user.address = data['address']
      user.phone = data['phone']
      db.session.commit()
      return jsonify({'name':user.username,'lastname':user.lastname,'email':user.email,'role':user.role,'phone':user.phone})

  return jsonify({}), 404

@views.route('/updateUserPass/<id>', methods=["GET","POST"])
@login_required
def updateUserPass(id):
  data = request.get_json()
  user = Users.query.filter_by(id=id).first();

  old= data['old_pass']
  new = data['new_pass']
  confirm = data['confirm_pass']

  if user:
    if new == confirm:
      user.password =  generate_password_hash(new, method='sha256')
      db.session.commit()
      return jsonify({'mssg':'User Password changed successfully.'})
    else:
      return jsonify({'mssg':'New password and Confirm password do not match.'})
  else:
    # return jsonify({'mssg':'User Id is not correct.'})
    pass

  return jsonify({}), 404

@views.route('/remove_record/<id>', methods=["GET","POST"])
@login_required
def removeMeetingrecord(id):
  isMeeting = False; isFacilitators = False
  user = current_user
  if user.role == 'Admin':
    try:
      if id:
        print('=================step1=================')
        facilitators = Facilitators.query.filter_by(meetingId=id).all()
        for facilitator in facilitators:
          db.session.delete(facilitator)
          db.session.commit()
        isMeeting = True
      
      if isMeeting:
        print('=================step2=================')
        participants = Participants.query.filter_by(meetingId=id).all()
        for participant in participants:
          db.session.delete(participant)
          db.session.commit()
        isFacilitators = True
      
      if isFacilitators:  
        print('=================step3=================')
        meeting = Meetings.query.get(int(id))
        db.session.delete(meeting)
        db.session.commit()
        flash('Record deleted successfully.','success')
    except:
      flash('Failed to delete the record. Try again.', 'error')
  else:
    flash('You don\'t have rights to remove the record. Please see ADMIN.','error')

  return redirect(url_for('views.home'))