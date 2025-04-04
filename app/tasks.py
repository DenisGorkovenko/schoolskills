import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas

from database import SessionLocal, get_db
from pydantic import BaseModel

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
@router.get('/multiplication_table/')
def multiplication_table_gen():
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
        question = f'{num1} : {num2}'

    return {'question': question, 'answer': answer}


@router.post('/multiplication_table/')
def multiplication_table_answer(math_example: schemas.MathExpression):
    correct_answer = eval(math_example.question)
    if math_example.answer == correct_answer:
        return {'message': 'Верно!'}
    else:
        return {'message': 'Неверно!'}


# 2. Задание на сложение и вычитание до 20
@router.get('/add_subtrac_twenty/')
def add_subtrac_twenty_gen():
    result = add_subtrac_gen(0, 20)
    return result


@router.post('/add_subtrac_twenty/')
def add_subtrac_twenty_answer(math_example: schemas.MathExpression):
    correct_answer = eval(math_example.question)
    if math_example.answer == correct_answer:
        return {'message': 'Верно!'}
    else:
        return {'message': 'Неверно!'}


# 3. Задание на сложение и вычитание до 100
@router.get('/add_subtrac_one_hundred/')
def add_subtrac_one_hundred_gen():
    result = add_subtrac_gen(0, 100)
    return result


@router.post('/add_subtrac_one_hundred/')
def add_subtrac_one_hundred_answer(math_example: schemas.MathExpression):
    correct_answer = eval(math_example.question)
    if math_example.answer == correct_answer:
        return {'message': 'Верно!'}
    else:
        return {'message': 'Неверно!'}


# 4. Задание на сравнение


@router.get('/comparison_expression/')
def comparison_expression_gen():
    left_expression = add_subtrac_gen(0, 20)
    right_expression = add_subtrac_gen(0, 20)

    return {
        'left_expression': left_expression,
        'right_expression': right_expression
    }


@router.post("/comparison_expression/")
def comparison_expression_answer(math_example: schemas.ComparisonExp):
    left_value = eval(math_example.left_expression)
    right_value = eval(math_example.right_expression)

    if math_example.comparison_sign == "<":
        is_correct = left_value < right_value
    elif math_example.comparison_sign == ">":
        is_correct = left_value > right_value
    elif math_example.comparison_sign == "=":
        is_correct = left_value == right_value
    else:
        return {"message": "Неверный знак сравнения."}

    if is_correct:
        return {"message": "Верно!"}
    else:
        return {"message": "Неверно!"}


@router.post("/math_question/")
def math_question_add(quest_data: schemas.QuestionCreate, db: SessionLocal = Depends(get_db)):
    db_quest = models.Task(question=quest_data.question, answer=quest_data.answer)
    db.add(db_quest)
    db.commit()
    db.refresh(db_quest)
    db.close()
    return db_quest


# 5. Решение задач
@router.get("/random_task/")
def get_random_task(db: SessionLocal = Depends(get_db)):
    tasks = db.query(models.Task).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")
    return random.choice(tasks)

#
# @router.post("/check_answer/")
# def check_answer(task_id: int, user_answer: str, db: Session = Depends(SessionLocal)):
#     task = db.query(models.Task).filter(models.Task.id == task_id).first()
#     if not task:
#         raise HTTPException(status_code=404, detail="Task not found")
#
#     is_correct = user_answer == task.answer
#     return {"is_correct": is_correct}
