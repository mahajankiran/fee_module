delimiter //
create trigger update_fees
after insert on student
for each row
begin
INSERT INTO applied_scholarship VALUE (new.stud_id,3,0);
INSERT INTO academic_payment(stud_id) VALUE (new.stud_id);
select tution_fee+development_fee+university_fee as total_fee from fee_structure where new.category = category into @a;
update academic_payment set acad_pay_amount = @a where stud_id = new.stud_id;
end //
delimiter ;
