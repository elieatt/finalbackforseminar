const user =
{
    "id": 1,
    "name": "nasser",
    "email": "nasser@gmail.com",
    "category": null,
    "age": 22,
    "year": null,
    "isDoctor": 1,
    "photo_path": null,
    "isAdmin": 0,
    "livestream_id": "0",
    "subjects": [
        {
            "id": 1,
            "year": 5,
            "duration": 8,
            "name": "analyse",
            "specialty": "programming",
            "category": 5,
            "department": "practical",
            "laboratory": "9",
            "DR": 1,
            "pivot": {
                "user_id": 1,
                "subject_id": 1,
                "created_at": null,
                "updated_at": "2023-06-30T23:11:43.000000Z",
                "passed": 0,
                "presence": 1
            }
        },
        {
            "id": 2,
            "year": 5,
            "duration": 8,
            "name": "bio",
            "specialty": "programming",
            "category": 5,
            "department": "practical",
            "laboratory": "9",
            "DR": 1,
            "pivot": {
                "user_id": 1,
                "subject_id": 2,
                "created_at": null,
                "updated_at": null,
                "passed": 0,
                "presence": 0
            }
        }
    ]
}
    ;
/* for (let subject of user.subjects){
console.log(subject.id, typeof subject.id);
} */
let names=[]
names.push(`${1}`);
names.push(`${2}`);
console.log(names);