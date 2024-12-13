from flask import Blueprint, flash, jsonify, redirect, render_template, request, url_for
from flask_login import login_required, login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import Users
from app.utils import addNewUser, deleteUser
from . import db


auth = Blueprint('auth', __name__)

@auth.route('/')
def start():
   return redirect(url_for('auth.login'))

@auth.route('/login', methods=["GET","POST"])
def login():
  mssg = None
  if request.method == "POST":
    email = request.form.get('email')
    password = request.form.get('password')

    user = Users.query.filter_by(email=email).first()
    if user:
      if check_password_hash(user.password, password):
        login_user(user, remember=True)
        flash('Success!! authentication passed.', 'success')
        return redirect(url_for('views.home'))
      else:
        mssg = 'error'
        flash('Warning: your password is weak!! secure it by hashing.','error')
    else:
       flash('Error: the account you used is not recognized, Register first!!','error')
  return render_template('login.html',mssg=mssg)

@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
  if request.method == 'POST':
    name = request.form.get('username')
    lastname = request.form.get('lastname')
    email = request.form.get('email')
    phone= request.form.get('phone')
    role = request.form.get('role')
    password1 = request.form.get('password')
    password2 = request.form.get('cpassword')
    country = request.form.get('country')
    company = request.form.get('company')
    address = request.form.get('address')

    user = Users.query.filter_by(email=email).first()
    if user:
      flash('Error: email already exists.', 'error')
    elif len(email) < 4:
        flash('Error: email must be greater than 3 characters.', 'error')
    elif len(name) < 2:
        flash('Error: first name must be greater than 1 character.', 'error')
    elif password1 != password2:
        flash('Error: passwords don\'t match.', 'error')
    elif len(password1) < 7:
        flash('Error: password must be at least 7 characters.', 'error')
    else:
      new_user = Users(email=email, username=name, lastname=lastname, phone=phone,role=role, password=generate_password_hash(password1, method='sha256'),country=country,company=company,address=address)
      db.session.add(new_user)
      db.session.commit()
      flash('Success!! Account created successfully!', 'success')
      return redirect(url_for('auth.login'))

  return render_template("register.html",)

@auth.route('/logout')
@login_required
def logout():
  logout_user()
  return redirect(url_for('auth.login'))

@auth.route('/addUser', methods=["POST","GET"])
@login_required
def addUser():
  name=request.json['name']
  lastname=request.json['lastname']
  email=request.json['email']
  password=request.json['password']
  role=request.json['role']
  phone=request.json['phone']
  country = request.json['country']
  company = request.json['company']
  address = request.json['address']

  try:
    addNewUser(name=name,lastname=lastname,email=email,password=generate_password_hash(password, method='sha256'),role=role,number=phone,country=country,company=company,address=address)
  except:
    flash('Error: could not add user','error')
  return jsonify({})

@auth.route('/changeUser/<int:id>', methods=["POST","GET"])
@login_required
def changeUser(id):
  data = request.get_json()
  user = Users.query.get(id)
  if user:
    # hashed_password = generate_password_hash(data['password'],method='sha256')
    user.username = data['name']
    user.lastname = data['lastname']
    user.email = data['email']
    # user.password = hashed_password
    user.role = data['role']
    user.phone = data['phone']
    db.session.commit()
    return jsonify({})
  return jsonify({}), 404

@auth.route('/deleteUser/<int:id>', methods=["POST","GET"])
@login_required
def delete_user(id):
  try:
    deleteUser(id)
  except:
    flash('Error: could not find the record. Issues with id!!')
    return jsonify({})
  return jsonify({})