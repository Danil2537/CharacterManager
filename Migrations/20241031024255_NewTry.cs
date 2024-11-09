using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CharacterManager.Migrations
{
    /// <inheritdoc />
    public partial class NewTry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Backgrounds",
                columns: table => new
                {
                    BackgroundId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: true),
                    CharacterName = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    BackgroundTools = table.Column<string>(type: "TEXT", nullable: true),
                    BackgroundLanguages = table.Column<string>(type: "TEXT", nullable: true),
                    BackgroundIdeal = table.Column<string>(type: "TEXT", nullable: true),
                    BackgroundBond = table.Column<string>(type: "TEXT", nullable: true),
                    BackgroundFlaw = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Backgrounds", x => x.BackgroundId);
                });

            migrationBuilder.CreateTable(
                name: "Dice",
                columns: table => new
                {
                    DiceId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DiceNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    Faces = table.Column<int>(type: "INTEGER", nullable: false),
                    Bonus = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dice", x => x.DiceId);
                });

            migrationBuilder.CreateTable(
                name: "Spells",
                columns: table => new
                {
                    SpellId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    BaseLevel = table.Column<int>(type: "INTEGER", nullable: false),
                    CastingTime = table.Column<string>(type: "TEXT", nullable: true),
                    Range = table.Column<int>(type: "INTEGER", nullable: false),
                    IsVerbal = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsSomatic = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsMaterial = table.Column<bool>(type: "INTEGER", nullable: false),
                    RequiredMaterials = table.Column<string>(type: "TEXT", nullable: true),
                    MaterialCost = table.Column<int>(type: "INTEGER", nullable: false),
                    Duration = table.Column<string>(type: "TEXT", nullable: true),
                    Source = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    IsSave = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsAttack = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsConcentration = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsRitual = table.Column<bool>(type: "INTEGER", nullable: false),
                    AtHigherLevels = table.Column<string>(type: "TEXT", nullable: true),
                    DmgDiceNum = table.Column<int>(type: "INTEGER", nullable: false),
                    DmgDiceFaces = table.Column<int>(type: "INTEGER", nullable: false),
                    DmgBonus = table.Column<int>(type: "INTEGER", nullable: false),
                    DmgType = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Spells", x => x.SpellId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserName = table.Column<string>(type: "TEXT", nullable: true),
                    Password = table.Column<string>(type: "TEXT", nullable: true),
                    Email = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Classes",
                columns: table => new
                {
                    ClassId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Source = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    MainAbility = table.Column<int>(type: "INTEGER", nullable: false),
                    HitDieType = table.Column<int>(type: "INTEGER", nullable: false),
                    HitDieNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    SubclassLevel = table.Column<int>(type: "INTEGER", nullable: false),
                    SubclassDescription = table.Column<string>(type: "TEXT", nullable: true),
                    AbilityIncreaseLevels = table.Column<string>(type: "TEXT", nullable: true),
                    HaveSpells = table.Column<bool>(type: "INTEGER", nullable: false),
                    SkillProficienciesNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    SkillExpertisesNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    ProficientSavingThrows = table.Column<string>(type: "TEXT", nullable: true),
                    SkillProfOptions = table.Column<string>(type: "TEXT", nullable: true),
                    ProficientSkills = table.Column<string>(type: "TEXT", nullable: true),
                    ExpertiseSkills = table.Column<string>(type: "TEXT", nullable: true),
                    StartingGoldDice = table.Column<string>(type: "TEXT", nullable: true),
                    StartingGold = table.Column<int>(type: "INTEGER", nullable: false),
                    StartingItemsOptions = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Classes", x => x.ClassId);
                    table.ForeignKey(
                        name: "FK_Classes_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    ItemId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    IsFromBackground = table.Column<bool>(type: "INTEGER", nullable: false),
                    BelongToBackground = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.ItemId);
                    table.ForeignKey(
                        name: "FK_Items_Backgrounds_BelongToBackground",
                        column: x => x.BelongToBackground,
                        principalTable: "Backgrounds",
                        principalColumn: "BackgroundId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Items_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Species",
                columns: table => new
                {
                    SpeciesId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Source = table.Column<string>(type: "TEXT", nullable: true),
                    Size = table.Column<int>(type: "INTEGER", nullable: false),
                    Speed = table.Column<int>(type: "INTEGER", nullable: false),
                    FlyingSpeed = table.Column<int>(type: "INTEGER", nullable: false),
                    SwimmingSpeed = table.Column<int>(type: "INTEGER", nullable: false),
                    Darkvision = table.Column<int>(type: "INTEGER", nullable: false),
                    LanguagesChoices = table.Column<int>(type: "INTEGER", nullable: false),
                    Languages = table.Column<string>(type: "TEXT", nullable: true),
                    SkillProficiencies = table.Column<int>(type: "INTEGER", nullable: false),
                    AbilityBonuses = table.Column<string>(type: "TEXT", nullable: true),
                    SkillProfOptions = table.Column<string>(type: "TEXT", nullable: true),
                    ProficientSkills = table.Column<string>(type: "TEXT", nullable: true),
                    ProficientSavingThrows = table.Column<string>(type: "TEXT", nullable: true),
                    Resistances = table.Column<string>(type: "TEXT", nullable: true),
                    Immunities = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Species", x => x.SpeciesId);
                    table.ForeignKey(
                        name: "FK_Species_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Subclasses",
                columns: table => new
                {
                    SubclassId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    ShortDescription = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    SpellcastingAbility = table.Column<int>(type: "INTEGER", nullable: false),
                    CanCastSpells = table.Column<bool>(type: "INTEGER", nullable: false),
                    SpellList = table.Column<string>(type: "TEXT", nullable: true),
                    SpellPrepareType = table.Column<bool>(type: "INTEGER", nullable: false),
                    AdditionalSpells = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "INTEGER", nullable: true),
                    ClassDTOClassId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subclasses", x => x.SubclassId);
                    table.ForeignKey(
                        name: "FK_Subclasses_Classes_ClassDTOClassId",
                        column: x => x.ClassDTOClassId,
                        principalTable: "Classes",
                        principalColumn: "ClassId");
                    table.ForeignKey(
                        name: "FK_Subclasses_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Characters",
                columns: table => new
                {
                    CharacterId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Gender = table.Column<string>(type: "TEXT", nullable: true),
                    Age = table.Column<int>(type: "INTEGER", nullable: false),
                    Height = table.Column<int>(type: "INTEGER", nullable: false),
                    Weight = table.Column<int>(type: "INTEGER", nullable: false),
                    Level = table.Column<int>(type: "INTEGER", nullable: false),
                    Speed = table.Column<int>(type: "INTEGER", nullable: false),
                    CurrentHealth = table.Column<int>(type: "INTEGER", nullable: false),
                    MaxHealth = table.Column<int>(type: "INTEGER", nullable: false),
                    TempHealth = table.Column<int>(type: "INTEGER", nullable: false),
                    ArmorClass = table.Column<int>(type: "INTEGER", nullable: false),
                    InitiativeBonus = table.Column<int>(type: "INTEGER", nullable: false),
                    SpellAttack = table.Column<int>(type: "INTEGER", nullable: false),
                    RangeAttack = table.Column<int>(type: "INTEGER", nullable: false),
                    SaveDC = table.Column<int>(type: "INTEGER", nullable: false),
                    CharacterAbilities = table.Column<string>(type: "TEXT", nullable: true),
                    CharacterSkills = table.Column<string>(type: "TEXT", nullable: true),
                    ProficientSkills = table.Column<string>(type: "TEXT", nullable: true),
                    ProficientSavingThrows = table.Column<string>(type: "TEXT", nullable: true),
                    Inventory = table.Column<string>(type: "TEXT", nullable: true),
                    Spellbook = table.Column<string>(type: "TEXT", nullable: true),
                    PreparedSpells = table.Column<string>(type: "TEXT", nullable: true),
                    ItemProficiencies = table.Column<string>(type: "TEXT", nullable: true),
                    Money = table.Column<string>(type: "TEXT", nullable: true),
                    CharClassClassId = table.Column<int>(type: "INTEGER", nullable: true),
                    CharSubClassSubclassId = table.Column<int>(type: "INTEGER", nullable: true),
                    CharSpeciesSpeciesId = table.Column<int>(type: "INTEGER", nullable: true),
                    BackgroundId = table.Column<int>(type: "INTEGER", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Characters", x => x.CharacterId);
                    table.ForeignKey(
                        name: "FK_Characters_Backgrounds_BackgroundId",
                        column: x => x.BackgroundId,
                        principalTable: "Backgrounds",
                        principalColumn: "BackgroundId");
                    table.ForeignKey(
                        name: "FK_Characters_Classes_CharClassClassId",
                        column: x => x.CharClassClassId,
                        principalTable: "Classes",
                        principalColumn: "ClassId");
                    table.ForeignKey(
                        name: "FK_Characters_Species_CharSpeciesSpeciesId",
                        column: x => x.CharSpeciesSpeciesId,
                        principalTable: "Species",
                        principalColumn: "SpeciesId");
                    table.ForeignKey(
                        name: "FK_Characters_Subclasses_CharSubClassSubclassId",
                        column: x => x.CharSubClassSubclassId,
                        principalTable: "Subclasses",
                        principalColumn: "SubclassId");
                    table.ForeignKey(
                        name: "FK_Characters_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Feats",
                columns: table => new
                {
                    FeatId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    MultiClassInfo = table.Column<string>(type: "TEXT", nullable: true),
                    HasOptions = table.Column<bool>(type: "INTEGER", nullable: false),
                    Type = table.Column<int>(type: "INTEGER", nullable: false),
                    UnlockAtLevel = table.Column<int>(type: "INTEGER", nullable: false),
                    IsFromBackground = table.Column<bool>(type: "INTEGER", nullable: false),
                    BelongToBackground = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "INTEGER", nullable: true),
                    ClassDTOClassId = table.Column<int>(type: "INTEGER", nullable: true),
                    SpeciesDTOSpeciesId = table.Column<int>(type: "INTEGER", nullable: true),
                    SubclassDTOSubclassId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feats", x => x.FeatId);
                    table.ForeignKey(
                        name: "FK_Feats_Backgrounds_BelongToBackground",
                        column: x => x.BelongToBackground,
                        principalTable: "Backgrounds",
                        principalColumn: "BackgroundId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Feats_Classes_ClassDTOClassId",
                        column: x => x.ClassDTOClassId,
                        principalTable: "Classes",
                        principalColumn: "ClassId");
                    table.ForeignKey(
                        name: "FK_Feats_Species_SpeciesDTOSpeciesId",
                        column: x => x.SpeciesDTOSpeciesId,
                        principalTable: "Species",
                        principalColumn: "SpeciesId");
                    table.ForeignKey(
                        name: "FK_Feats_Subclasses_SubclassDTOSubclassId",
                        column: x => x.SubclassDTOSubclassId,
                        principalTable: "Subclasses",
                        principalColumn: "SubclassId");
                    table.ForeignKey(
                        name: "FK_Feats_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "FeatOptions",
                columns: table => new
                {
                    FeatOptionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FeatOptionName = table.Column<string>(type: "TEXT", nullable: true),
                    FeatOptionDescription = table.Column<string>(type: "TEXT", nullable: true),
                    BelongToFeat = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeatOptions", x => x.FeatOptionId);
                    table.ForeignKey(
                        name: "FK_FeatOptions_Feats_BelongToFeat",
                        column: x => x.BelongToFeat,
                        principalTable: "Feats",
                        principalColumn: "FeatId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Characters_BackgroundId",
                table: "Characters",
                column: "BackgroundId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_CharClassClassId",
                table: "Characters",
                column: "CharClassClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_CharSpeciesSpeciesId",
                table: "Characters",
                column: "CharSpeciesSpeciesId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_CharSubClassSubclassId",
                table: "Characters",
                column: "CharSubClassSubclassId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_CreatedByUserId",
                table: "Characters",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_CreatedByUserId",
                table: "Classes",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatOptions_BelongToFeat",
                table: "FeatOptions",
                column: "BelongToFeat");

            migrationBuilder.CreateIndex(
                name: "IX_Feats_BelongToBackground",
                table: "Feats",
                column: "BelongToBackground",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Feats_ClassDTOClassId",
                table: "Feats",
                column: "ClassDTOClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Feats_CreatedByUserId",
                table: "Feats",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Feats_SpeciesDTOSpeciesId",
                table: "Feats",
                column: "SpeciesDTOSpeciesId");

            migrationBuilder.CreateIndex(
                name: "IX_Feats_SubclassDTOSubclassId",
                table: "Feats",
                column: "SubclassDTOSubclassId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_BelongToBackground",
                table: "Items",
                column: "BelongToBackground");

            migrationBuilder.CreateIndex(
                name: "IX_Items_CreatedByUserId",
                table: "Items",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Species_CreatedByUserId",
                table: "Species",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Subclasses_ClassDTOClassId",
                table: "Subclasses",
                column: "ClassDTOClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Subclasses_CreatedByUserId",
                table: "Subclasses",
                column: "CreatedByUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Characters");

            migrationBuilder.DropTable(
                name: "Dice");

            migrationBuilder.DropTable(
                name: "FeatOptions");

            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropTable(
                name: "Spells");

            migrationBuilder.DropTable(
                name: "Feats");

            migrationBuilder.DropTable(
                name: "Backgrounds");

            migrationBuilder.DropTable(
                name: "Species");

            migrationBuilder.DropTable(
                name: "Subclasses");

            migrationBuilder.DropTable(
                name: "Classes");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
