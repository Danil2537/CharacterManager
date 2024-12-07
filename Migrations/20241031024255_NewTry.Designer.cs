﻿// <auto-generated />
using System;
using CharacterManager.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace CharacterManager.Migrations
{
    [DbContext(typeof(CharacterManagerDbContext))]
    [Migration("20241031024255_NewTry")]
    partial class NewTry
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.10");

            modelBuilder.Entity("CharacterManager.DTOs.BackgroundDTO", b =>
                {
                    b.Property<int>("BackgroundId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("BackgroundBond")
                        .HasColumnType("TEXT");

                    b.Property<string>("BackgroundFlaw")
                        .HasColumnType("TEXT");

                    b.Property<string>("BackgroundIdeal")
                        .HasColumnType("TEXT");

                    b.Property<string>("BackgroundLanguages")
                        .HasColumnType("TEXT");

                    b.Property<string>("BackgroundTools")
                        .HasColumnType("TEXT");

                    b.Property<string>("CharacterName")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.HasKey("BackgroundId");

                    b.ToTable("Backgrounds");
                });

            modelBuilder.Entity("CharacterManager.DTOs.CharacterDTO", b =>
                {
                    b.Property<int>("CharacterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("Age")
                        .HasColumnType("INTEGER");

                    b.Property<int>("ArmorClass")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("BackgroundId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CharClassClassId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CharSpeciesSpeciesId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CharSubClassSubclassId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("CharacterAbilitiesSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("CharacterAbilities");

                    b.Property<string>("CharacterSkillsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("CharacterSkills");

                    b.Property<int?>("CreatedByUserId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("CurrentHealth")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Gender")
                        .HasColumnType("TEXT");

                    b.Property<int>("Height")
                        .HasColumnType("INTEGER");

                    b.Property<int>("InitiativeBonus")
                        .HasColumnType("INTEGER");

                    b.Property<string>("InventorySerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("Inventory");

                    b.Property<string>("ItemProficienciesSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("ItemProficiencies");

                    b.Property<int>("Level")
                        .HasColumnType("INTEGER");

                    b.Property<int>("MaxHealth")
                        .HasColumnType("INTEGER");

                    b.Property<string>("MoneySerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("Money");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("PreparedSpellsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("PreparedSpells");

                    b.Property<string>("ProficientSavingThrowsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("ProficientSavingThrows");

                    b.Property<string>("ProficientSkillsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("ProficientSkills");

                    b.Property<int>("RangeAttack")
                        .HasColumnType("INTEGER");

                    b.Property<int>("SaveDC")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Speed")
                        .HasColumnType("INTEGER");

                    b.Property<int>("SpellAttack")
                        .HasColumnType("INTEGER");

                    b.Property<string>("SpellbookSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("Spellbook");

                    b.Property<int>("TempHealth")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Weight")
                        .HasColumnType("INTEGER");

                    b.HasKey("CharacterId");

                    b.HasIndex("BackgroundId");

                    b.HasIndex("CharClassClassId");

                    b.HasIndex("CharSpeciesSpeciesId");

                    b.HasIndex("CharSubClassSubclassId");

                    b.HasIndex("CreatedByUserId");

                    b.ToTable("Characters");
                });

            modelBuilder.Entity("CharacterManager.DTOs.ClassDTO", b =>
                {
                    b.Property<int>("ClassId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AbilityIncreaseLevelsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("AbilityIncreaseLevels");

                    b.Property<int?>("CreatedByUserId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<string>("ExpertiseSkillsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("ExpertiseSkills");

                    b.Property<bool>("HaveSpells")
                        .HasColumnType("INTEGER");

                    b.Property<int>("HitDieNumber")
                        .HasColumnType("INTEGER");

                    b.Property<int>("HitDieType")
                        .HasColumnType("INTEGER");

                    b.Property<int>("MainAbility")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProficientSavingThrowsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("ProficientSavingThrows");

                    b.Property<string>("ProficientSkillsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("ProficientSkills");

                    b.Property<int>("SkillExpertisesNumber")
                        .HasColumnType("INTEGER");

                    b.Property<string>("SkillProfOptionsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("SkillProfOptions");

                    b.Property<int>("SkillProficienciesNumber")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Source")
                        .HasColumnType("TEXT");

                    b.Property<int>("StartingGold")
                        .HasColumnType("INTEGER");

                    b.Property<string>("StartingGoldDiceSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("StartingGoldDice");

                    b.Property<string>("StartingItemsOptionsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("StartingItemsOptions");

                    b.Property<string>("SubclassDescription")
                        .HasColumnType("TEXT");

                    b.Property<int>("SubclassLevel")
                        .HasColumnType("INTEGER");

                    b.HasKey("ClassId");

                    b.HasIndex("CreatedByUserId");

                    b.ToTable("Classes");
                });

            modelBuilder.Entity("CharacterManager.DTOs.DiceDTO", b =>
                {
                    b.Property<int>("DiceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("Bonus")
                        .HasColumnType("INTEGER");

                    b.Property<int>("DiceNumber")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Faces")
                        .HasColumnType("INTEGER");

                    b.HasKey("DiceId");

                    b.ToTable("Dice");
                });

            modelBuilder.Entity("CharacterManager.DTOs.FeatDTO", b =>
                {
                    b.Property<int>("FeatId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("BelongToBackground")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ClassDTOClassId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CreatedByUserId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<bool>("HasOptions")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsFromBackground")
                        .HasColumnType("INTEGER");

                    b.Property<string>("MultiClassInfo")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("SpeciesDTOSpeciesId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("SubclassDTOSubclassId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Type")
                        .HasColumnType("INTEGER");

                    b.Property<int>("UnlockAtLevel")
                        .HasColumnType("INTEGER");

                    b.HasKey("FeatId");

                    b.HasIndex("BelongToBackground")
                        .IsUnique();

                    b.HasIndex("ClassDTOClassId");

                    b.HasIndex("CreatedByUserId");

                    b.HasIndex("SpeciesDTOSpeciesId");

                    b.HasIndex("SubclassDTOSubclassId");

                    b.ToTable("Feats");
                });

            modelBuilder.Entity("CharacterManager.DTOs.FeatOptionDTO", b =>
                {
                    b.Property<int>("FeatOptionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("BelongToFeat")
                        .HasColumnType("INTEGER");

                    b.Property<string>("FeatOptionDescription")
                        .HasColumnType("TEXT");

                    b.Property<string>("FeatOptionName")
                        .HasColumnType("TEXT");

                    b.HasKey("FeatOptionId");

                    b.HasIndex("BelongToFeat");

                    b.ToTable("FeatOptions");
                });

            modelBuilder.Entity("CharacterManager.DTOs.ItemDTO", b =>
                {
                    b.Property<int>("ItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("BelongToBackground")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CreatedByUserId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsFromBackground")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.HasKey("ItemId");

                    b.HasIndex("BelongToBackground");

                    b.HasIndex("CreatedByUserId");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("CharacterManager.DTOs.SpeciesDTO", b =>
                {
                    b.Property<int>("SpeciesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AbilityBonusesSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("AbilityBonuses");

                    b.Property<int?>("CreatedByUserId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Darkvision")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<int>("FlyingSpeed")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ImmunitiesSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("Immunities");

                    b.Property<int>("LanguagesChoices")
                        .HasColumnType("INTEGER");

                    b.Property<string>("LanguagesSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("Languages");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProficientSavingThrowsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("ProficientSavingThrows");

                    b.Property<string>("ProficientSkillsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("ProficientSkills");

                    b.Property<string>("ResistancesSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("Resistances");

                    b.Property<int>("Size")
                        .HasColumnType("INTEGER");

                    b.Property<string>("SkillProfOptionsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("SkillProfOptions");

                    b.Property<int>("SkillProficiencies")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Source")
                        .HasColumnType("TEXT");

                    b.Property<int>("Speed")
                        .HasColumnType("INTEGER");

                    b.Property<int>("SwimmingSpeed")
                        .HasColumnType("INTEGER");

                    b.HasKey("SpeciesId");

                    b.HasIndex("CreatedByUserId");

                    b.ToTable("Species");
                });

            modelBuilder.Entity("CharacterManager.DTOs.SpellDTO", b =>
                {
                    b.Property<int>("SpellId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AtHigherLevels")
                        .HasColumnType("TEXT");

                    b.Property<int>("BaseLevel")
                        .HasColumnType("INTEGER");

                    b.Property<string>("CastingTime")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<int>("DmgBonus")
                        .HasColumnType("INTEGER");

                    b.Property<int>("DmgDiceFaces")
                        .HasColumnType("INTEGER");

                    b.Property<int>("DmgDiceNum")
                        .HasColumnType("INTEGER");

                    b.Property<string>("DmgType")
                        .HasColumnType("TEXT");

                    b.Property<string>("Duration")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsAttack")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsConcentration")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsMaterial")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsRitual")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsSave")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsSomatic")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsVerbal")
                        .HasColumnType("INTEGER");

                    b.Property<int>("MaterialCost")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<int>("Range")
                        .HasColumnType("INTEGER");

                    b.Property<string>("RequiredMaterials")
                        .HasColumnType("TEXT");

                    b.Property<string>("Source")
                        .HasColumnType("TEXT");

                    b.HasKey("SpellId");

                    b.ToTable("Spells");
                });

            modelBuilder.Entity("CharacterManager.DTOs.SubclassDTO", b =>
                {
                    b.Property<int>("SubclassId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AdditionalSpellsSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("AdditionalSpells");

                    b.Property<bool>("CanCastSpells")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ClassDTOClassId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CreatedByUserId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("ShortDescription")
                        .HasColumnType("TEXT");

                    b.Property<string>("SpellListSerialized")
                        .HasColumnType("TEXT")
                        .HasColumnName("SpellList");

                    b.Property<bool>("SpellPrepareType")
                        .HasColumnType("INTEGER");

                    b.Property<int>("SpellcastingAbility")
                        .HasColumnType("INTEGER");

                    b.HasKey("SubclassId");

                    b.HasIndex("ClassDTOClassId");

                    b.HasIndex("CreatedByUserId");

                    b.ToTable("Subclasses");
                });

            modelBuilder.Entity("CharacterManager.DTOs.UserDTO", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .HasColumnType("TEXT");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("CharacterManager.DTOs.CharacterDTO", b =>
                {
                    b.HasOne("CharacterManager.DTOs.BackgroundDTO", "Background")
                        .WithMany()
                        .HasForeignKey("BackgroundId");

                    b.HasOne("CharacterManager.DTOs.ClassDTO", "CharClass")
                        .WithMany()
                        .HasForeignKey("CharClassClassId");

                    b.HasOne("CharacterManager.DTOs.SpeciesDTO", "CharSpecies")
                        .WithMany()
                        .HasForeignKey("CharSpeciesSpeciesId");

                    b.HasOne("CharacterManager.DTOs.SubclassDTO", "CharSubClass")
                        .WithMany()
                        .HasForeignKey("CharSubClassSubclassId");

                    b.HasOne("CharacterManager.DTOs.UserDTO", "CreatedByUser")
                        .WithMany("CharacterList")
                        .HasForeignKey("CreatedByUserId");

                    b.Navigation("Background");

                    b.Navigation("CharClass");

                    b.Navigation("CharSpecies");

                    b.Navigation("CharSubClass");

                    b.Navigation("CreatedByUser");
                });

            modelBuilder.Entity("CharacterManager.DTOs.ClassDTO", b =>
                {
                    b.HasOne("CharacterManager.DTOs.UserDTO", "CreatedByUser")
                        .WithMany("CreatedClasses")
                        .HasForeignKey("CreatedByUserId");

                    b.Navigation("CreatedByUser");
                });

            modelBuilder.Entity("CharacterManager.DTOs.FeatDTO", b =>
                {
                    b.HasOne("CharacterManager.DTOs.BackgroundDTO", "Background")
                        .WithOne("BackgroundFeat")
                        .HasForeignKey("CharacterManager.DTOs.FeatDTO", "BelongToBackground")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CharacterManager.DTOs.ClassDTO", null)
                        .WithMany("ClassFeats")
                        .HasForeignKey("ClassDTOClassId");

                    b.HasOne("CharacterManager.DTOs.UserDTO", "CreatedByUser")
                        .WithMany("CreatedFeats")
                        .HasForeignKey("CreatedByUserId");

                    b.HasOne("CharacterManager.DTOs.SpeciesDTO", null)
                        .WithMany("SpeciesFeats")
                        .HasForeignKey("SpeciesDTOSpeciesId");

                    b.HasOne("CharacterManager.DTOs.SubclassDTO", null)
                        .WithMany("SubclassFeats")
                        .HasForeignKey("SubclassDTOSubclassId");

                    b.Navigation("Background");

                    b.Navigation("CreatedByUser");
                });

            modelBuilder.Entity("CharacterManager.DTOs.FeatOptionDTO", b =>
                {
                    b.HasOne("CharacterManager.DTOs.FeatDTO", "Feat")
                        .WithMany("FeatOptions")
                        .HasForeignKey("BelongToFeat")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Feat");
                });

            modelBuilder.Entity("CharacterManager.DTOs.ItemDTO", b =>
                {
                    b.HasOne("CharacterManager.DTOs.BackgroundDTO", "Background")
                        .WithMany("Items")
                        .HasForeignKey("BelongToBackground")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CharacterManager.DTOs.UserDTO", "CreatedByUser")
                        .WithMany("CreatedItems")
                        .HasForeignKey("CreatedByUserId");

                    b.Navigation("Background");

                    b.Navigation("CreatedByUser");
                });

            modelBuilder.Entity("CharacterManager.DTOs.SpeciesDTO", b =>
                {
                    b.HasOne("CharacterManager.DTOs.UserDTO", "CreatedByUser")
                        .WithMany("CreatedSpecies")
                        .HasForeignKey("CreatedByUserId");

                    b.Navigation("CreatedByUser");
                });

            modelBuilder.Entity("CharacterManager.DTOs.SubclassDTO", b =>
                {
                    b.HasOne("CharacterManager.DTOs.ClassDTO", null)
                        .WithMany("AvailableSubclasses")
                        .HasForeignKey("ClassDTOClassId");

                    b.HasOne("CharacterManager.DTOs.UserDTO", "CreatedByUser")
                        .WithMany("CreatedSubclasses")
                        .HasForeignKey("CreatedByUserId");

                    b.Navigation("CreatedByUser");
                });

            modelBuilder.Entity("CharacterManager.DTOs.BackgroundDTO", b =>
                {
                    b.Navigation("BackgroundFeat");

                    b.Navigation("Items");
                });

            modelBuilder.Entity("CharacterManager.DTOs.ClassDTO", b =>
                {
                    b.Navigation("AvailableSubclasses");

                    b.Navigation("ClassFeats");
                });

            modelBuilder.Entity("CharacterManager.DTOs.FeatDTO", b =>
                {
                    b.Navigation("FeatOptions");
                });

            modelBuilder.Entity("CharacterManager.DTOs.SpeciesDTO", b =>
                {
                    b.Navigation("SpeciesFeats");
                });

            modelBuilder.Entity("CharacterManager.DTOs.SubclassDTO", b =>
                {
                    b.Navigation("SubclassFeats");
                });

            modelBuilder.Entity("CharacterManager.DTOs.UserDTO", b =>
                {
                    b.Navigation("CharacterList");

                    b.Navigation("CreatedClasses");

                    b.Navigation("CreatedFeats");

                    b.Navigation("CreatedItems");

                    b.Navigation("CreatedSpecies");

                    b.Navigation("CreatedSubclasses");
                });
#pragma warning restore 612, 618
        }
    }
}
