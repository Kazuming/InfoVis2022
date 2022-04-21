import random
colors = ["red", "orange", "pink", "snow", "yellow", "green", "lime", "cyan","blue","purple"]
def create_csv(n):
    data = "x,y,r,color\n"
    for _ in range(n):
        x = random.randrange(10, 1190, 10)
        y = random.randrange(10, 990, 10)
        r = random.randrange(10, 30, 2)
        color = colors[random.randrange(len(colors))]
        data += f"{x},{y},{r},{color}\n"
    f = open(f"w04_task1.csv", 'w')
    f.write(data)

create_csv(100)