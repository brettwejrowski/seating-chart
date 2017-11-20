from plinko import client

guest_list = [
  [
    {
      "name": "Martha Washington",
      "tags": []
    },
    {
      "name": "George Washington",
      "tags": [
        "1780",
        "1790",
        "No Party",
        "6 Star General"
      ]
    }
  ],
  [
    {
      "name": "Abigail Adams",
      "tags": []
    },
    {
      "name": "John Adams",
      "tags": [
        "1790",
        "1800",
        "Federalist"
      ]
    }
  ],
  [
    {
      "name": "Martha Wayles Skelton Jefferson",
      "tags": []
    },
    {
      "name": "Thomas Jefferson",
      "tags": [
        "1800",
        "1800",
        "Democratic-Republican"
      ]
    }
  ],
  [
    {
      "name": "Dolley Madison",
      "tags": []
    },
    {
      "name": "James Madison",
      "tags": [
        "1800",
        "1810",
        "Democratic-Republican"
      ]
    }
  ],
  [
    {
      "name": "Elizabeth Kortright Monroe",
      "tags": []
    },
    {
      "name": "James Monroe",
      "tags": [
        "1810",
        "1820",
        "Democratic-Republican"
      ]
    }
  ],
  [
    {
      "name": "Louisa Catherine Adams",
      "tags": []
    },
    {
      "name": "John Quincy Adams",
      "tags": [
        "1820",
        "1820",
        "Democratic-Republican"
      ]
    }
  ],
  [
    {
      "name": "Rachel Jackson",
      "tags": []
    },
    {
      "name": "Andrew Jackson",
      "tags": [
        "1820",
        "1830",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Hannah Hoes Van Buren",
      "tags": []
    },
    {
      "name": "Martin Van Buren",
      "tags": [
        "1830",
        "1840",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Anna Tuthill Symmes Harrison",
      "tags": []
    },
    {
      "name": "William Henry Harrison",
      "tags": [
        "1840",
        "Whig"
      ]
    }
  ],
  [
    {
      "name": "Letitia Christian Tyler",
      "tags": []
    },
    {
      "name": "Julia Gardiner Tyler",
      "tags": []
    },
    {
      "name": "John Tyler",
      "tags": [
        "1840",
        "1840",
        "Whig"
      ]
    }
  ],
  [
    {
      "name": "Sarah Childress Polk",
      "tags": []
    },
    {
      "name": "James K. Polk",
      "tags": [
        "1840",
        "1840",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Margaret Mackall Smith Taylor",
      "tags": []
    },
    {
      "name": "Zachary Taylor",
      "tags": [
        "1840",
        "1850",
        "Whig",
        "Rumored Assassination"
      ]
    }
  ],
  [
    {
      "name": "Abigail Powers Fillmore",
      "tags": []
    },
    {
      "name": "Millard Fillmore",
      "tags": [
        "1850",
        "1850",
        "Whig"
      ]
    }
  ],
  [
    {
      "name": "Jane M. Pierce",
      "tags": []
    },
    {
      "name": "Franklin Pierce",
      "tags": [
        "1850",
        "NaN",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Jane M. Pierce",
      "tags": []
    },
    {
      "name": "Franklin Pierce",
      "tags": [
        "1850",
        "1850",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "James Buchanan",
      "tags": [
        "1850",
        "1860",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Mary Todd Lincoln",
      "tags": []
    },
    {
      "name": "Abraham Lincoln",
      "tags": [
        "1860",
        "1860",
        "Republican",
        "Assassinated"
      ]
    }
  ],
  [
    {
      "name": "Eliza McCardle Johnson",
      "tags": []
    },
    {
      "name": "Andrew Johnson",
      "tags": [
        "1860",
        "1860",
        "Democratic",
        "Impeached"
      ]
    }
  ],
  [
    {
      "name": "Julia Dent Grant",
      "tags": []
    },
    {
      "name": "Ulysses S. Grant",
      "tags": [
        "1860",
        "1870",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Julia Dent Grant",
      "tags": []
    },
    {
      "name": "Ulysses S. Grant",
      "tags": [
        "1870",
        "1870",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Julia Dent Grant",
      "tags": []
    },
    {
      "name": "Ulysses S. Grant",
      "tags": [
        "1870",
        "1870",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Lucy Webb Hayes",
      "tags": []
    },
    {
      "name": "Rutherford Birchard Hayes",
      "tags": [
        "1870",
        "1880",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Lucretia Rudolph Garfield",
      "tags": []
    },
    {
      "name": "James A. Garfield",
      "tags": [
        "1880",
        "NaN",
        "Republican",
        "Assassinated"
      ]
    }
  ],
  [
    {
      "name": "Ellen Lewis Herndon Arthur",
      "tags": []
    },
    {
      "name": "Chester A. Arthur",
      "tags": [
        "1880",
        "1880",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Frances Folsom Cleveland",
      "tags": []
    },
    {
      "name": "Grover Cleveland",
      "tags": [
        "1880",
        "NaN",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Frances Folsom Cleveland",
      "tags": []
    },
    {
      "name": "Grover Cleveland",
      "tags": [
        "1880",
        "1880",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Caroline Lavinia Scott Harrison",
      "tags": []
    },
    {
      "name": "Mary Lord Harrison",
      "tags": []
    },
    {
      "name": "Benjamin Harrison",
      "tags": [
        "1880",
        "1890",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Frances Folsom Cleveland",
      "tags": []
    },
    {
      "name": "Grover Cleveland",
      "tags": [
        "1890",
        "1890",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Ida Saxton McKinley",
      "tags": []
    },
    {
      "name": "William McKinley",
      "tags": [
        "1890",
        "1890",
        "Republican",
        "Assassinated"
      ]
    }
  ],
  [
    {
      "name": "Ida Saxton McKinley",
      "tags": []
    },
    {
      "name": "William McKinley",
      "tags": [
        "1890",
        "1900",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Ida Saxton McKinley",
      "tags": []
    },
    {
      "name": "William McKinley",
      "tags": [
        "1900",
        "NaN",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Edith Kermit Carow Roosevelt",
      "tags": []
    },
    {
      "name": "Theodore Roosevelt",
      "tags": [
        "1900",
        "1900",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Edith Kermit Carow Roosevelt",
      "tags": []
    },
    {
      "name": "Theodore Roosevelt",
      "tags": [
        "1900",
        "1900",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Helen Herron Taft",
      "tags": []
    },
    {
      "name": "William H. Taft",
      "tags": [
        "1900",
        "1910",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Ellen Axson Wilson",
      "tags": []
    },
    {
      "name": "Edith Bolling Galt Wilson",
      "tags": []
    },
    {
      "name": "Woodrow Wilson",
      "tags": [
        "1910",
        "1920",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Florence Kling Harding",
      "tags": []
    },
    {
      "name": "Warren G. Harding",
      "tags": [
        "1920",
        "1920",
        "Republican",
        "Rumored Assassination"
      ]
    }
  ],
  [
    {
      "name": "Grace Goodhue Coolidge",
      "tags": []
    },
    {
      "name": "Calvin Coolidge",
      "tags": [
        "1920",
        "1920",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Grace Goodhue Coolidge",
      "tags": []
    },
    {
      "name": "Calvin Coolidge",
      "tags": [
        "1920",
        "1920",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Lou Henry Hoover",
      "tags": []
    },
    {
      "name": "Herbert Hoover",
      "tags": [
        "1920",
        "1930",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Eleanor Roosevelt",
      "tags": []
    },
    {
      "name": "Franklin D. Roosevelt",
      "tags": [
        "1930",
        "1940",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Bess Wallace Truman",
      "tags": []
    },
    {
      "name": "Harry S. Truman",
      "tags": [
        "1940",
        "1950",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Mamie Doud Eisenhower",
      "tags": []
    },
    {
      "name": "Dwight D. Eisenhower",
      "tags": [
        "1950",
        "1960",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Jacqueline Kennedy Onassis",
      "tags": []
    },
    {
      "name": "John F. Kennedy",
      "tags": [
        "1960",
        "1960",
        "Democratic",
        "Assassinated"
      ]
    }
  ],
  [
    {
      "name": "Lady Bird Johnson",
      "tags": []
    },
    {
      "name": "Lyndon B. Johnson",
      "tags": [
        "1960",
        "1960",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Pat Nixon",
      "tags": []
    },
    {
      "name": "Richard M. Nixon",
      "tags": [
        "1960",
        "1970",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Betty Ford",
      "tags": []
    },
    {
      "name": "Gerald R. Ford",
      "tags": [
        "1970",
        "1970",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Rosalynn Carter",
      "tags": []
    },
    {
      "name": "Jimmy Carter",
      "tags": [
        "1970",
        "1980",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Nancy Reagan",
      "tags": []
    },
    {
      "name": "Ronald Reagan",
      "tags": [
        "1980",
        "1980",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Barbara Bush",
      "tags": []
    },
    {
      "name": "George Bush",
      "tags": [
        "1980",
        "1990",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Hillary Rodham Clinton",
      "tags": []
    },
    {
      "name": "Bill Clinton",
      "tags": [
        "1990",
        "2000",
        "Democratic",
        "Impeached"
      ]
    }
  ],
  [
    {
      "name": "Laura Bush",
      "tags": []
    },
    {
      "name": "George W. Bush",
      "tags": [
        "2000",
        "2000",
        "Republican"
      ]
    }
  ],
  [
    {
      "name": "Michelle Obama",
      "tags": []
    },
    {
      "name": "Barack Obama",
      "tags": [
        "2000",
        "2010",
        "Democratic"
      ]
    }
  ],
  [
    {
      "name": "Melania Trump",
      "tags": []
    },
    {
      "name": "Donald J. Trump",
      "tags": [
        "2010",
        "Republican"
      ]
    }
  ]
]

user_id = 'fake_user_id'


def seed():
    for group in guest_list:
        for guest in group:
            print guest['name']
        client.create_group(user_id, group)

    for x in range(3):
        for y in range(3):
            client.create_table(
                user_id,
                x=(x * 6),
                y=(y * 6),
                width=3,
                height=3,
                table_type='rect',
                number_of_seats=12,
            )


if __name__ == "__main__":
    seed()
