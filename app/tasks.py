import random
from fastapi import APIRouter, Depends, HTTPException
import models
import schemas
from app.users import get_current_user

from database import SessionLocal, get_db

router = APIRouter()


# Функция для генерации примеров на сложение и вычитание
def add_subtrac_gen(x, y):
    operation = random.choice(['addition', 'subtraction'])

    if operation == 'addition':
        num1 = random.randint(x, y)
        num2 = random.randint(x, y - num1)
        question = f"{num1} + {num2}"
        answer = num1 + num2
    else:
        num2 = random.randint(x, y)
        num1 = random.randint(num2, y)
        question = f'{num1} - {num2}'
        answer = num1 - num2

    return {'question': question, 'answer': answer}


# 1. Задание на таблицу умножения
@router.get('/multiplication_table_gen/')
def multiplication_table_gen(current_user: str = Depends(get_current_user)):
    operation = random.choice(['multiplication', 'division'])

    if operation == 'multiplication':
        num1 = random.randint(2, 9)
        num2 = random.randint(2, 9)
        question = f'{num1} * {num2}'
        answer = num1 * num2
    else:
        num2 = random.randint(2, 9)
        answer = random.randint(2, 9)
        num1 = answer * num2
        question = f'{num1} / {num2}'

    return {'question': question, 'answer': answer}


@router.post('/multiplication_table_answer/')
def multiplication_table_answer(math_example: schemas.MathExpression,
                                db: SessionLocal = Depends(get_db),
                                current_user: str = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail='Пользователя не существует!')
    correct_answer = eval(math_example.question)
    if math_example.answer == correct_answer:
        user.right_answer += 1
        message = 'Верно!'
    else:
        user.wrong_answer += 1
        message = 'Неверно!'

    db.commit()
    return {'message': message}


# 2. Задание на сложение и вычитание до 20
@router.get('/add_subtrac_twenty_gen/')
def add_subtrac_twenty_gen(current_user: str = Depends(get_current_user)):
    result = add_subtrac_gen(0, 20)
    return result


@router.post('/add_subtrac_twenty_answer/')
def add_subtrac_twenty_answer(math_example: schemas.MathExpression,
                              db: SessionLocal = Depends(get_db),
                              current_user: str = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail='Пользователя не существует!')
    correct_answer = eval(math_example.question)
    if math_example.answer == correct_answer:
        user.right_answer += 1
        message = 'Верно!'
    else:
        user.wrong_answer += 1
        message = 'Неверно!'

    db.commit()
    return {'message': message}


# 3. Задание на сложение и вычитание до 100
@router.get('/add_subtrac_one_hundred_gen/')
def add_subtrac_one_hundred_gen(current_user: str = Depends(get_current_user)):
    result = add_subtrac_gen(0, 100)
    return result


@router.post('/add_subtrac_one_hundred_answer/')
def add_subtrac_one_hundred_answer(math_example: schemas.MathExpression,
                                   db: SessionLocal = Depends(get_db),
                                   current_user: str = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail='Пользователя не существует!')
    correct_answer = eval(math_example.question)
    if math_example.answer == correct_answer:
        user.right_answer += 1
        message = 'Верно!'
    else:
        user.wrong_answer += 1
        message = 'Неверно!'

    db.commit()
    return {'message': message}


# 4. Задание на сравнение
@router.get('/comparison_expression_gen/')
def comparison_expression_gen(current_user: str = Depends(get_current_user)):
    left_expression = add_subtrac_gen(0, 20)
    right_expression = add_subtrac_gen(0, 20)

    return {
        'left_expression': left_expression,
        'right_expression': right_expression
    }


@router.post('/comparison_expression_answer/')
def comparison_expression_answer(math_example: schemas.ComparisonExp,
                                 db: SessionLocal = Depends(get_db),
                                 current_user: str = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail='Пользователя не существует!')
    left_value = eval(math_example.left_expression)
    right_value = eval(math_example.right_expression)

    if math_example.comparison_sign == '<':
        correct_answer = left_value < right_value
    elif math_example.comparison_sign == '>':
        correct_answer = left_value > right_value
    elif math_example.comparison_sign == '=':
        correct_answer = left_value == right_value
    else:
        return {'"message": "Неверный знак сравнения."'}

    if math_example.answer == correct_answer:
        user.right_answer += 1
        message = 'Верно!'
    else:
        user.wrong_answer += 1
        message = 'Неверно!'

    db.commit()
    return {'message': message}


@router.post('/math_question/')
def math_question_add(quest_data: schemas.QuestionCreate,
                      db: SessionLocal = Depends(get_db),
                      current_user: str = Depends(get_current_user)):
    db_quest = models.Task(question=quest_data.question, answer=quest_data.answer)
    db.add(db_quest)
    db.commit()
    db.refresh(db_quest)
    db.close()
    return db_quest


# 5. Решение задач
@router.get('/random_task/')
def get_random_task(db: SessionLocal = Depends(get_db), current_user: str = Depends(get_current_user)):
    tasks = db.query(models.Task).all()
    if not tasks:
        raise HTTPException(status_code=404, detail='Задачи не существует!')
    return random.choice(tasks)


@router.post('/check_answer_task/')
def check_answer_task(task_id: int, user_answer: str,
                      db: SessionLocal = Depends(get_db),
                      current_user: str = Depends(get_current_user)):

    user = db.query(models.User).filter(models.User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail='Пользователя не существует!')

    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail='Задачи не существует!')

    is_correct = user_answer == task.answer
    if is_correct:
        user.right_answer += 1
        message = 'Верно!'
    else:
        user.wrong_answer += 1
        message = 'Неверно!'

    db.commit()
    return {'message': message}
